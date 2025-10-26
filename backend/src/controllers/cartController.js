const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

// In-memory cart storage (in production, you might want to use Redis)
const userCarts = new Map();

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cart = userCarts.get(userId) || [];

    // Get product details for cart items
    const cartWithProducts = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.productId).select('-fileUrl');
        return {
          ...item,
          product
        };
      })
    );

    const total = cartWithProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      status: 'success',
      data: {
        items: cartWithProducts,
        total,
        count: cartWithProducts.length
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id.toString();

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or not available'
      });
    }

    // Get user's current cart
    const cart = userCarts.get(userId) || [];

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        id: uuidv4(), // Generate unique ID for cart item
        productId,
        title: product.title,
        price: product.price,
        type: product.type,
        image: product.image,
        quantity
      });
    }

    // Save updated cart
    userCarts.set(userId, cart);

    res.status(200).json({
      status: 'success',
      message: 'Item added to cart',
      data: {
        cart: cart,
        count: cart.length
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id.toString();

    const cart = userCarts.get(userId) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart[itemIndex].quantity = quantity;
    }

    userCarts.set(userId, cart);

    res.status(200).json({
      status: 'success',
      message: 'Cart updated',
      data: {
        cart: cart,
        count: cart.length
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id.toString();

    const cart = userCarts.get(userId) || [];
    const filteredCart = cart.filter(item => item.id !== itemId);

    userCarts.set(userId, filteredCart);

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      data: {
        cart: filteredCart,
        count: filteredCart.length
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    userCarts.set(userId, []);

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared',
      data: {
        cart: [],
        count: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};

