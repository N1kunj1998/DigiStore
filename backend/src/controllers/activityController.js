const UserActivity = require('../models/UserActivity');
const User = require('../models/User');
const Product = require('../models/Product');

// Track user activity
const trackActivity = async (req, res) => {
  try {
    const {
      userId,
      sessionId,
      activityType,
      activityData,
      deviceInfo,
      location,
      conversionValue = 0,
      conversionType,
      funnelStage
    } = req.body;

    // Validate required fields
    if (!userId || !sessionId || !activityType) {
      return res.status(400).json({
        status: 'error',
        message: 'userId, sessionId, and activityType are required'
      });
    }

    // Create activity record
    const activity = await UserActivity.create({
      userId,
      sessionId,
      activityType,
      activityData: activityData || {},
      deviceInfo: deviceInfo || {},
      location: location || {},
      conversionValue,
      conversionType,
      funnelStage,
      timestamp: new Date()
    });

    // Update user's last activity and engagement score
    await updateUserEngagement(userId, activityType, conversionValue);

    res.status(201).json({
      status: 'success',
      message: 'Activity tracked successfully',
      data: { activity }
    });
  } catch (error) {
    console.error('Track activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get user activity analytics
const getUserActivityAnalytics = async (req, res) => {
  try {
    const { userId, days = 30, activityType, funnelStage } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Build filter
    const filter = {
      timestamp: { $gte: startDate }
    };
    
    if (userId) filter.userId = userId;
    if (activityType) filter.activityType = activityType;
    if (funnelStage) filter.funnelStage = funnelStage;

    // Get activity summary
    const activities = await UserActivity.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('activityData.productId', 'title price type')
      .sort({ timestamp: -1 });

    // Calculate analytics
    const analytics = {
      totalActivities: activities.length,
      uniqueUsers: new Set(activities.map(a => a.userId._id.toString())).size,
      uniqueSessions: new Set(activities.map(a => a.sessionId)).size,
      activityTypes: {},
      funnelStages: {},
      conversionMetrics: {
        totalValue: 0,
        conversions: 0,
        conversionRate: 0
      },
      topPages: {},
      topProducts: {},
      hourlyDistribution: {},
      dailyDistribution: {}
    };

    activities.forEach(activity => {
      // Activity types
      analytics.activityTypes[activity.activityType] = 
        (analytics.activityTypes[activity.activityType] || 0) + 1;

      // Funnel stages
      if (activity.funnelStage) {
        analytics.funnelStages[activity.funnelStage] = 
          (analytics.funnelStages[activity.funnelStage] || 0) + 1;
      }

      // Conversion metrics
      analytics.conversionMetrics.totalValue += activity.conversionValue || 0;
      if (activity.conversionValue > 0) {
        analytics.conversionMetrics.conversions++;
      }

      // Top pages
      if (activity.activityData.page) {
        analytics.topPages[activity.activityData.page] = 
          (analytics.topPages[activity.activityData.page] || 0) + 1;
      }

      // Top products
      if (activity.activityData.productId) {
        const productTitle = activity.activityData.productId.title || 'Unknown Product';
        analytics.topProducts[productTitle] = 
          (analytics.topProducts[productTitle] || 0) + 1;
      }

      // Hourly distribution
      const hour = activity.timestamp.getHours();
      analytics.hourlyDistribution[hour] = 
        (analytics.hourlyDistribution[hour] || 0) + 1;

      // Daily distribution
      const day = activity.timestamp.toISOString().split('T')[0];
      analytics.dailyDistribution[day] = 
        (analytics.dailyDistribution[day] || 0) + 1;
    });

    // Calculate conversion rate
    if (analytics.totalActivities > 0) {
      analytics.conversionMetrics.conversionRate = 
        (analytics.conversionMetrics.conversions / analytics.totalActivities) * 100;
    }

    res.status(200).json({
      status: 'success',
      data: {
        analytics,
        activities: activities.slice(0, 100) // Return recent activities
      }
    });
  } catch (error) {
    console.error('Get user activity analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get conversion funnel
const getConversionFunnel = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const funnel = await UserActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          funnelStage: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$funnelStage',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          totalConversionValue: { $sum: '$conversionValue' }
        }
      },
      {
        $project: {
          stage: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          totalConversionValue: 1,
          conversionRate: { $divide: ['$count', '$count'] }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Calculate stage-to-stage conversion rates
    const funnelWithRates = funnel.map((stage, index) => {
      const nextStage = funnel[index + 1];
      const conversionRate = nextStage ? 
        ((nextStage.count / stage.count) * 100).toFixed(2) : 0;
      
      return {
        ...stage,
        nextStageConversionRate: parseFloat(conversionRate)
      };
    });

    res.status(200).json({
      status: 'success',
      data: { funnel: funnelWithRates }
    });
  } catch (error) {
    console.error('Get conversion funnel error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get user journey
const getUserJourney = async (req, res) => {
  try {
    const { userId, sessionId, days = 7 } = req.query;
    
    if (!userId && !sessionId) {
      return res.status(400).json({
        status: 'error',
        message: 'Either userId or sessionId is required'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const filter = {
      timestamp: { $gte: startDate }
    };
    
    if (userId) filter.userId = userId;
    if (sessionId) filter.sessionId = sessionId;

    const journey = await UserActivity.find(filter)
      .populate('activityData.productId', 'title price type image')
      .sort({ timestamp: 1 });

    // Group by session
    const sessions = {};
    journey.forEach(activity => {
      const sessionKey = activity.sessionId;
      if (!sessions[sessionKey]) {
        sessions[sessionKey] = {
          sessionId: sessionKey,
          userId: activity.userId,
          startTime: activity.timestamp,
          endTime: activity.timestamp,
          activities: [],
          totalTime: 0,
          conversionValue: 0
        };
      }
      
      sessions[sessionKey].activities.push(activity);
      sessions[sessionKey].endTime = activity.timestamp;
      sessions[sessionKey].conversionValue += activity.conversionValue || 0;
    });

    // Calculate session duration
    Object.values(sessions).forEach(session => {
      session.totalTime = Math.round(
        (session.endTime - session.startTime) / 1000
      );
    });

    res.status(200).json({
      status: 'success',
      data: { 
        sessions: Object.values(sessions),
        totalSessions: Object.keys(sessions).length
      }
    });
  } catch (error) {
    console.error('Get user journey error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get real-time activity feed
const getRealTimeActivity = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const activities = await UserActivity.find()
      .populate('userId', 'firstName lastName email')
      .populate('activityData.productId', 'title price type')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { activities }
    });
  } catch (error) {
    console.error('Get real-time activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Helper function to update user engagement score
const updateUserEngagement = async (userId, activityType, conversionValue) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    let engagementIncrease = 0;
    
    // Define engagement scores for different activities
    const activityScores = {
      'page_view': 1,
      'product_view': 2,
      'add_to_cart': 5,
      'checkout_start': 10,
      'payment_success': 20,
      'download': 3,
      'search': 2,
      'login': 1,
      'register': 5
    };

    engagementIncrease = activityScores[activityType] || 1;
    
    // Bonus for conversions
    if (conversionValue > 0) {
      engagementIncrease += Math.min(conversionValue / 10, 50); // Cap at 50
    }

    // Update engagement score (with decay over time)
    const daysSinceLastActivity = user.lastActivity ? 
      (new Date() - user.lastActivity) / (1000 * 60 * 60 * 24) : 0;
    
    const decayFactor = Math.max(0.9, 1 - (daysSinceLastActivity * 0.1));
    const newEngagementScore = Math.min(100, 
      (user.engagementScore || 0) * decayFactor + engagementIncrease
    );

    await User.findByIdAndUpdate(userId, {
      engagementScore: newEngagementScore,
      lastActivity: new Date()
    });
  } catch (error) {
    console.error('Update user engagement error:', error);
  }
};

// Get engagement metrics
const getEngagementMetrics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const metrics = await UserActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalActivities: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' },
          conversionValue: { $sum: '$conversionValue' },
          lastActivity: { $max: '$timestamp' }
        }
      },
      {
        $project: {
          userId: '$_id',
          totalActivities: 1,
          uniqueSessions: { $size: '$uniqueSessions' },
          conversionValue: 1,
          lastActivity: 1,
          engagementScore: {
            $multiply: [
              { $add: ['$totalActivities', { $multiply: ['$conversionValue', 0.1] }] },
              2
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          avgActivitiesPerUser: { $avg: '$totalActivities' },
          avgSessionsPerUser: { $avg: '$uniqueSessions' },
          totalConversionValue: { $sum: '$conversionValue' },
          avgEngagementScore: { $avg: '$engagementScore' },
          highlyEngagedUsers: {
            $sum: {
              $cond: [{ $gte: ['$engagementScore', 50] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { 
        metrics: metrics[0] || {
          totalUsers: 0,
          avgActivitiesPerUser: 0,
          avgSessionsPerUser: 0,
          totalConversionValue: 0,
          avgEngagementScore: 0,
          highlyEngagedUsers: 0
        }
      }
    });
  } catch (error) {
    console.error('Get engagement metrics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  trackActivity,
  getUserActivityAnalytics,
  getConversionFunnel,
  getUserJourney,
  getRealTimeActivity,
  getEngagementMetrics
};
