const express = require('express');
const router = express.Router();
const { initDatabase, testConnection } = require('../config/database');

// Test database connection
router.get('/test', async (req, res) => {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      res.json({
        success: true,
        message: 'Database connection successful'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Database connection failed'
      });
    }
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: 'Database test failed'
    });
  }
});

// Initialize database tables
router.post('/init', async (req, res) => {
  try {
    await initDatabase();
    
    res.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Database initialization failed'
    });
  }
});

// Get menu options
router.get('/menu-options', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const connection = await pool.getConnection();
    
    const query = `
      SELECT * FROM menu_options 
      WHERE is_active = TRUE 
      ORDER BY menu_name, option_key
    `;
    
    const [rows] = await connection.execute(query);
    connection.release();
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching menu options:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu options'
    });
  }
});

// Add menu option
router.post('/menu-options', async (req, res) => {
  try {
    const { menuName, optionKey, optionText, actionType, actionValue } = req.body;
    
    if (!menuName || !optionKey || !optionText || !actionType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    const { pool } = require('../config/database');
    const connection = await pool.getConnection();
    
    const query = `
      INSERT INTO menu_options (menu_name, option_key, option_text, action_type, action_value)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [menuName, optionKey, optionText, actionType, actionValue || null];
    
    const [result] = await connection.execute(query, values);
    connection.release();
    
    res.json({
      success: true,
      message: 'Menu option added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error adding menu option:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add menu option'
    });
  }
});

// Update menu option
router.put('/menu-options/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { menuName, optionKey, optionText, actionType, actionValue, isActive } = req.body;
    
    const { pool } = require('../config/database');
    const connection = await pool.getConnection();
    
    const query = `
      UPDATE menu_options 
      SET menu_name = ?, option_key = ?, option_text = ?, 
          action_type = ?, action_value = ?, is_active = ?
      WHERE id = ?
    `;
    
    const values = [menuName, optionKey, optionText, actionType, actionValue, isActive, id];
    
    const [result] = await connection.execute(query, values);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Menu option not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Menu option updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu option:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update menu option'
    });
  }
});

// Delete menu option
router.delete('/menu-options/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { pool } = require('../config/database');
    const connection = await pool.getConnection();
    
    const query = 'DELETE FROM menu_options WHERE id = ?';
    const [result] = await connection.execute(query, [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Menu option not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Menu option deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu option:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete menu option'
    });
  }
});

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const connection = await pool.getConnection();
    
    // Get table row counts
    const tables = ['calls', 'call_logs', 'menu_options'];
    const stats = {};
    
    for (const table of tables) {
      const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      stats[table] = rows[0].count;
    }
    
    // Get database size info
    const [dbInfo] = await connection.execute(`
      SELECT 
        table_name,
        ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'size_mb'
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `);
    
    connection.release();
    
    res.json({
      success: true,
      data: {
        rowCounts: stats,
        tableSizes: dbInfo
      }
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch database statistics'
    });
  }
});

module.exports = router; 