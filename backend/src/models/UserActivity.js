const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow activities from unauthenticated users
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  activityType: {
    type: String,
    required: true,
    enum: [
      // Page visits
      'page_view',
      'product_view',
      'category_view',
      
      // Cart activities
      'add_to_cart',
      'remove_from_cart',
      'update_cart',
      'view_cart',
      
      // Checkout process
      'checkout_start',
      'checkout_step',
      'payment_attempt',
      'payment_success',
      'payment_failed',
      
      // User actions
      'login',
      'logout',
      'register',
      'profile_update',
      'password_change',
      
      // Engagement
      'search',
      'filter',
      'sort',
      'download',
      'share',
      'bookmark',
      
      // Lead generation
      'lead_magnet_view',
      'lead_magnet_download',
      'newsletter_signup',
      
      // Support
      'contact_form',
      'faq_view',
      'support_ticket',
      
      // Business metrics
      'session_start',
      'session_end',
      'bounce',
      'return_visit'
    ]
  },
  activityData: {
    // Page/Product specific
    page: String,
    productId: mongoose.Schema.Types.ObjectId,
    category: String,
    searchQuery: String,
    
    // Cart specific
    cartItemId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    price: Number,
    
    // Checkout specific
    checkoutStep: String,
    paymentMethod: String,
    orderId: mongoose.Schema.Types.ObjectId,
    totalAmount: Number,
    
    // User specific
    userAgent: String,
    ipAddress: String,
    referrer: String,
    
    // Engagement specific
    timeSpent: Number, // in seconds
    scrollDepth: Number, // percentage
    clicks: Number,
    
    // Custom data
    metadata: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Device and location info
  deviceInfo: {
    deviceType: String, // mobile, tablet, desktop
    browser: String,
    os: String,
    screenResolution: String,
    userAgent: String,
    ipAddress: String
  },
  // Geographic info (if available)
  location: {
    country: String,
    region: String,
    city: String,
    timezone: String
  },
  // Conversion tracking
  conversionValue: {
    type: Number,
    default: 0
  },
  conversionType: {
    type: String,
    enum: ['purchase', 'lead', 'download', 'signup', 'engagement']
  },
  // Funnel stage
  funnelStage: {
    type: String,
    enum: ['awareness', 'interest', 'consideration', 'intent', 'purchase', 'retention']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ activityType: 1, timestamp: -1 });
userActivitySchema.index({ sessionId: 1, timestamp: -1 });
userActivitySchema.index({ 'activityData.productId': 1, timestamp: -1 });
userActivitySchema.index({ funnelStage: 1, timestamp: -1 });

// Virtual for time-based queries
userActivitySchema.virtual('date').get(function() {
  return this.timestamp.toISOString().split('T')[0];
});

// Static method to get user activity summary
userActivitySchema.statics.getUserActivitySummary = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const activities = await this.find({
    userId,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: -1 });
  
  const summary = {
    totalActivities: activities.length,
    uniqueSessions: new Set(activities.map(a => a.sessionId)).size,
    activityTypes: {},
    funnelStages: {},
    conversionValue: 0,
    lastActivity: activities[0]?.timestamp || null,
    topPages: {},
    topProducts: {}
  };
  
  activities.forEach(activity => {
    // Count activity types
    summary.activityTypes[activity.activityType] = 
      (summary.activityTypes[activity.activityType] || 0) + 1;
    
    // Count funnel stages
    if (activity.funnelStage) {
      summary.funnelStages[activity.funnelStage] = 
        (summary.funnelStages[activity.funnelStage] || 0) + 1;
    }
    
    // Sum conversion value
    summary.conversionValue += activity.conversionValue || 0;
    
    // Track top pages
    if (activity.activityData.page) {
      summary.topPages[activity.activityData.page] = 
        (summary.topPages[activity.activityData.page] || 0) + 1;
    }
    
    // Track top products
    if (activity.activityData.productId) {
      const productId = activity.activityData.productId.toString();
      summary.topProducts[productId] = 
        (summary.topProducts[productId] || 0) + 1;
    }
  });
  
  return summary;
};

// Static method to get conversion funnel
userActivitySchema.statics.getConversionFunnel = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const funnel = await this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate },
        funnelStage: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$funnelStage',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        stage: '$_id',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        conversionRate: { $divide: ['$count', '$count'] }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  return funnel;
};

module.exports = mongoose.model('UserActivity', userActivitySchema);
