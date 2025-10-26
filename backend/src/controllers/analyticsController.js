const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Lead = require('../models/Lead');

// Get analytics overview
const getAnalyticsOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    if (Object.keys(dateFilter).length > 0) {
      dateFilter.createdAt = dateFilter;
    }

    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalLeads = await Lead.countDocuments();

    // Get revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed', ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const recentLeads = await Lead.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalLeads,
          totalRevenue,
          recentOrders,
          recentLeads
        }
      }
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get sales analytics
const getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Get sales by period
    const salesByPeriod = await Order.aggregate([
      { $match: { status: 'completed', ...dateFilter } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === 'day' ? '%Y-%m-%d' : 
                     period === 'week' ? '%Y-%U' :
                     period === 'month' ? '%Y-%m' : '%Y',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: { status: 'completed', ...dateFilter } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          title: { $first: '$items.title' },
          type: { $first: '$items.type' },
          totalSold: { $sum: 1 },
          revenue: { $sum: '$items.price' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        salesByPeriod,
        topProducts
      }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get product analytics
const getProductAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Get products by type
    const productsByType = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    // Get products by category
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get most popular products (by download count)
    const popularProducts = await Product.find({ isActive: true })
      .sort({ downloadCount: -1 })
      .limit(10)
      .select('title type category price downloadCount');

    res.status(200).json({
      status: 'success',
      data: {
        productsByType,
        productsByCategory,
        popularProducts
      }
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get user analytics
const getUserAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Get user registration trends
    const userRegistrations = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get user activity
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        userRegistrations,
        activeUsers,
        totalUsers,
        activityRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAnalyticsOverview,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics
};

