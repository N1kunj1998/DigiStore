const Lead = require('../models/Lead');

// Create lead
const createLead = async (req, res) => {
  try {
    const leadData = req.body;

    // Check if lead already exists with this email and source
    const existingLead = await Lead.findOne({
      email: leadData.email,
      source: leadData.source
    });

    if (existingLead) {
      return res.status(200).json({
        status: 'success',
        message: 'Lead already exists',
        data: { lead: existingLead }
      });
    }

    const lead = await Lead.create(leadData);

    res.status(201).json({
      status: 'success',
      message: 'Lead created successfully',
      data: { lead }
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get leads (admin only)
const getLeads = async (req, res) => {
  try {
    const { status, source, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;

    const skip = (Number(page) - 1) * Number(limit);

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        leads,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get single lead
const getLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        status: 'error',
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { lead }
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update lead status
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        status: 'error',
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Lead status updated',
      data: { lead }
    });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get lead statistics
const getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const contactedLeads = await Lead.countDocuments({ status: 'contacted' });
    const nurturingLeads = await Lead.countDocuments({ status: 'nurturing' });
    const convertedLeads = await Lead.countDocuments({ status: 'converted' });

    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    // Get leads by source
    const leadsBySource = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get recent leads (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLeads = await Lead.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          total: totalLeads,
          new: newLeads,
          contacted: contactedLeads,
          nurturing: nurturingLeads,
          converted: convertedLeads,
          conversionRate,
          recent: recentLeads
        },
        bySource: leadsBySource,
        byStatus: leadsByStatus
      }
    });
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLeadStatus,
  getLeadStats
};

