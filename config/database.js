const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ivr_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create calls table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS calls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        call_sid VARCHAR(255) UNIQUE NOT NULL,
        from_number VARCHAR(20) NOT NULL,
        to_number VARCHAR(20) NOT NULL,
        call_status VARCHAR(50) NOT NULL,
        call_duration INT DEFAULT 0,
        recording_url VARCHAR(500),
        transcription TEXT,
        user_input VARCHAR(10),
        menu_selection VARCHAR(50),
        language_selected VARCHAR(20),
        house_number VARCHAR(20),
        service_rating INT,
        rating_text VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_call_sid (call_sid),
        INDEX idx_from_number (from_number),
        INDEX idx_created_at (created_at),
        INDEX idx_language (language_selected),
        INDEX idx_house_number (house_number),
        INDEX idx_rating (service_rating)
      )
    `);

    // Create call_logs table for detailed call tracking
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS call_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        call_sid VARCHAR(255) NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        event_data JSON,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_call_sid (call_sid),
        INDEX idx_event_type (event_type),
        INDEX idx_timestamp (timestamp)
      )
    `);

    // Create menu_options table for IVR menu configuration
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menu_options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menu_name VARCHAR(100) NOT NULL,
        option_key VARCHAR(10) NOT NULL,
        option_text TEXT NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        action_value TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_menu_option (menu_name, option_key),
        INDEX idx_menu_name (menu_name),
        INDEX idx_is_active (is_active)
      )
    `);

    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
}; 