import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { trackEvent } from "../components/Analytics";
import { apiService } from "../services/api";

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  type: "pdf" | "video" | "workbook";
  quantity: number;
  product?: {
    id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    image: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from backend or localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      if (apiService.isAuthenticated()) {
        // Load from backend for authenticated users
        try {
          setIsLoading(true);
          const response = await apiService.getCart();
          if (response.status === 'success' && response.data?.items) {
            setCartItems(response.data.items);
          }
        } catch (error) {
          console.error('Failed to load cart:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Load from localStorage for non-authenticated users
        try {
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            setCartItems(JSON.parse(localCart));
          }
        } catch (error) {
          console.error('Failed to load local cart:', error);
        }
      }
    };

    loadCart();
  }, []);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      setIsLoading(true);
      
      if (apiService.isAuthenticated()) {
        // Add to backend cart for authenticated users
        const response = await apiService.addToCart(item.productId, 1);
        
        if (response.status === 'success') {
          // Reload cart from backend
          const cartResponse = await apiService.getCart();
          if (cartResponse.status === 'success' && cartResponse.data?.items) {
            setCartItems(cartResponse.data.items);
          }
        }
      } else {
        // Add to local cart for non-authenticated users
        const newItem: CartItem = {
          id: `local_${Date.now()}`,
          productId: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          type: item.type,
          quantity: 1
        };

        setCartItems(prevItems => {
          // Check if item already exists
          const existingItemIndex = prevItems.findIndex(cartItem => cartItem.productId === item.productId);
          
          let updatedItems;
          if (existingItemIndex > -1) {
            // Update quantity if item exists
            updatedItems = prevItems.map((cartItem, index) => 
              index === existingItemIndex 
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          } else {
            // Add new item
            updatedItems = [...prevItems, newItem];
          }
          
          // Save to localStorage
          localStorage.setItem('cart', JSON.stringify(updatedItems));
          return updatedItems;
        });
      }
      
      toast.success("Added to cart");
      trackEvent('add_to_cart', {
        item_id: item.productId,
        item_name: item.title,
        item_category: item.type,
        value: item.price
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      setIsLoading(true);
      
      if (apiService.isAuthenticated()) {
        // Remove from backend cart for authenticated users
        const response = await apiService.removeFromCart(id);
        
        if (response.status === 'success') {
          // Reload cart from backend
          const cartResponse = await apiService.getCart();
          if (cartResponse.status === 'success' && cartResponse.data?.items) {
            setCartItems(cartResponse.data.items);
          }
        }
      } else {
        // Remove from local cart for non-authenticated users
        setCartItems(prevItems => {
          const updatedItems = prevItems.filter(item => item.id !== id);
          localStorage.setItem('cart', JSON.stringify(updatedItems));
          return updatedItems;
        });
      }
      
      toast.success("Removed from cart");
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (id: string, quantity: number) => {
    try {
      setIsLoading(true);
      
      if (apiService.isAuthenticated()) {
        // Update backend cart for authenticated users
        const response = await apiService.updateCartItem(id, quantity);
        
        if (response.status === 'success') {
          // Reload cart from backend
          const cartResponse = await apiService.getCart();
          if (cartResponse.status === 'success' && cartResponse.data?.items) {
            setCartItems(cartResponse.data.items);
          }
        }
      } else {
        // Update local cart for non-authenticated users
        setCartItems(prevItems => {
          const updatedItems = prevItems.map(item => 
            item.id === id ? { ...item, quantity } : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedItems));
          return updatedItems;
        });
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error('Failed to update cart item');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      
      if (apiService.isAuthenticated()) {
        // Clear backend cart for authenticated users
        const response = await apiService.clearCart();
        
        if (response.status === 'success') {
          setCartItems([]);
        }
      } else {
        // Clear local cart for non-authenticated users
        setCartItems([]);
        localStorage.removeItem('cart');
      }
      
      toast.success("Cart cleared");
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateCartItem,
        clearCart, 
        cartTotal, 
        cartCount,
        isLoading 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
