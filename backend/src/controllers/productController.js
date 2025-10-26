const Product = require('../models/Product');

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
  try {
    const {
      type,
      category,
      minPrice,
      maxPrice,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isActive: true, isDeleted: false };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-fileUrl'); // Don't expose file URLs in public listing

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select('-fileUrl');
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const {
      q,
      type,
      category,
      minPrice,
      maxPrice,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isActive: true, isDeleted: false };
    
    if (q) {
      filter.$text = { $search: q };
    }
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    const sort = {};
    if (q) {
      sort.score = { $meta: 'textScore' };
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-fileUrl');

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Soft delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { 
        isDeleted: true, 
        deletedAt: new Date(),
        isActive: false 
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Restore product (admin only)
const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { 
        isDeleted: false, 
        deletedAt: null,
        isActive: true 
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product restored successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Restore product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get all products for admin (including deleted)
const getAdminProducts = async (req, res) => {
  try {
    const {
      type,
      category,
      includeDeleted = false,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (!includeDeleted) filter.isDeleted = false;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get search suggestions
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        status: 'success',
        data: { suggestions: [] }
      });
    }

    // Search for products that match the query using regex for better compatibility
    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ],
      isActive: true,
      isDeleted: false
    })
    .select('title tags category')
    .limit(10);

    // Extract unique suggestions from titles, tags, and categories
    const suggestions = new Set();
    
    products.forEach(product => {
      // Add full title if it contains the query
      if (product.title.toLowerCase().includes(q.toLowerCase())) {
        suggestions.add(product.title);
      }
      
      // Add title words that match
      const titleWords = product.title.toLowerCase().split(' ');
      titleWords.forEach(word => {
        if (word.includes(q.toLowerCase()) && word.length > 2) {
          suggestions.add(word);
        }
      });
      
      // Add tags that match
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(q.toLowerCase())) {
          suggestions.add(tag);
        }
      });
      
      // Add category if it matches
      if (product.category.toLowerCase().includes(q.toLowerCase())) {
        suggestions.add(product.category);
      }
    });

    // Convert to array and sort by relevance
    const suggestionsArray = Array.from(suggestions)
      .filter(suggestion => suggestion.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => {
        // Prioritize exact matches and shorter suggestions
        const aExact = a.toLowerCase().startsWith(q.toLowerCase());
        const bExact = b.toLowerCase().startsWith(q.toLowerCase());
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        // Prioritize full titles over individual words
        const aIsTitle = products.some(p => p.title === a);
        const bIsTitle = products.some(p => p.title === b);
        if (aIsTitle && !bIsTitle) return -1;
        if (!aIsTitle && bIsTitle) return 1;
        return a.length - b.length;
      })
      .slice(0, 8);

    res.status(200).json({
      status: 'success',
      data: { suggestions: suggestionsArray }
    });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getAdminProducts,
  getSearchSuggestions
};

