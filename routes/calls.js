const express = require('express');
const router = express.Router();
const Call = require('../models/Call');

// Get all calls with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const calls = await Call.getAll(limit, offset);
    
    res.json({
      success: true,
      data: calls,
      pagination: {
        page,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calls'
    });
  }
});

// Get call statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Call.getCallStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching call stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch call statistics'
    });
  }
});

// Get specific call by SID
router.get('/:callSid', async (req, res) => {
  try {
    const { callSid } = req.params;
    const call = await Call.findByCallSid(callSid);
    
    if (!call) {
      return res.status(404).json({
        success: false,
        error: 'Call not found'
      });
    }
    
    res.json({
      success: true,
      data: call
    });
  } catch (error) {
    console.error('Error fetching call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch call'
    });
  }
});

// Get call logs for a specific call
router.get('/:callSid/logs', async (req, res) => {
  try {
    const { callSid } = req.params;
    const logs = await Call.getCallLogs(callSid);
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch call logs'
    });
  }
});

// Get calls by phone number
router.get('/number/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { pool } = require('../config/database');
    
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM calls 
      WHERE from_number = ? OR to_number = ?
      ORDER BY created_at DESC
    `;
    
    const [rows] = await connection.execute(query, [phoneNumber, phoneNumber]);
    connection.release();
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching calls by number:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calls by number'
    });
  }
});

// Get calls by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const { pool } = require('../config/database');
    
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM calls 
      WHERE call_status = ?
      ORDER BY created_at DESC
    `;
    
    const [rows] = await connection.execute(query, [status]);
    connection.release();
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching calls by status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calls by status'
    });
  }
});

// Get calls within date range
router.get('/date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }
    
    const { pool } = require('../config/database');
    const connection = await pool.getConnection();
    
    const query = `
      SELECT * FROM calls 
      WHERE created_at BETWEEN ? AND ?
      ORDER BY created_at DESC
    `;
    
    const [rows] = await connection.execute(query, [startDate, endDate]);
    connection.release();
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching calls by date range:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calls by date range'
    });
  }
});

// Get waste management statistics
router.get('/waste-management-stats', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const connection = await pool.getConnection();
    
    // Language distribution
    const languageQuery = `
      SELECT 
        language_selected,
        COUNT(*) as count
      FROM calls 
      WHERE language_selected IS NOT NULL
      GROUP BY language_selected
      ORDER BY count DESC
    `;
    
    // Rating distribution
    const ratingQuery = `
      SELECT 
        service_rating,
        rating_text,
        COUNT(*) as count
      FROM calls 
      WHERE service_rating IS NOT NULL
      GROUP BY service_rating, rating_text
      ORDER BY service_rating
    `;
    
    // Average rating
    const avgRatingQuery = `
      SELECT 
        AVG(service_rating) as avg_rating,
        COUNT(*) as total_ratings
      FROM calls 
      WHERE service_rating IS NOT NULL
    `;
    
    // House number distribution (top 10)
    const houseNumberQuery = `
      SELECT 
        house_number,
        COUNT(*) as count
      FROM calls 
      WHERE house_number IS NOT NULL
      GROUP BY house_number
      ORDER BY count DESC
      LIMIT 10
    `;
    
    const [languageStats] = await connection.execute(languageQuery);
    const [ratingStats] = await connection.execute(ratingQuery);
    const [avgRatingStats] = await connection.execute(avgRatingQuery);
    const [houseNumberStats] = await connection.execute(houseNumberQuery);
    
    connection.release();
    
    res.json({
      success: true,
      data: {
        languageDistribution: languageStats,
        ratingDistribution: ratingStats,
        averageRating: avgRatingStats[0],
        topHouseNumbers: houseNumberStats
      }
    });
  } catch (error) {
    console.error('Error fetching waste management stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch waste management statistics'
    });
  }
});

// Get menu selection statistics
router.get('/menu-stats', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const connection = await pool.getConnection();
    
    const query = `
      SELECT 
        menu_selection,
        COUNT(*) as count,
        AVG(call_duration) as avg_duration
      FROM calls 
      WHERE menu_selection IS NOT NULL
      GROUP BY menu_selection
      ORDER BY count DESC
    `;
    
    const [rows] = await connection.execute(query);
    connection.release();
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching menu stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu statistics'
    });
  }
});

module.exports = router; 