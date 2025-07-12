const { initDatabase, testConnection, pool } = require('../config/database');
require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Test connection first
    console.log('📡 Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Database connection failed. Please check your configuration.');
      process.exit(1);
    }
    
    // Initialize tables
    console.log('🗄️ Creating database tables...');
    await initDatabase();
    
    // Add sample menu options
    console.log('📋 Adding sample menu options...');
    await addSampleMenuOptions();
    
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function addSampleMenuOptions() {
  try {
    const connection = await pool.getConnection();
    
    // Sample menu options for the main IVR
    const sampleOptions = [
      {
        menu_name: 'main_menu',
        option_key: '1',
        option_text: 'Customer Support - Get help with your account or services',
        action_type: 'support',
        action_value: 'support_flow'
      },
      {
        menu_name: 'main_menu',
        option_key: '2',
        option_text: 'Sales Information - Learn about our products and promotions',
        action_type: 'sales',
        action_value: 'sales_flow'
      },
      {
        menu_name: 'main_menu',
        option_key: '3',
        option_text: 'Billing Inquiries - Check your balance and payment options',
        action_type: 'billing',
        action_value: 'billing_flow'
      },
      {
        menu_name: 'main_menu',
        option_key: '4',
        option_text: 'Speak with Representative - Connect with a live agent',
        action_type: 'transfer',
        action_value: '+1234567890'
      },
      {
        menu_name: 'main_menu',
        option_key: '5',
        option_text: 'Repeat Menu - Hear the options again',
        action_type: 'repeat',
        action_value: 'main_menu'
      },
      {
        menu_name: 'sales_menu',
        option_key: '1',
        option_text: 'Speak with Sales Representative',
        action_type: 'transfer',
        action_value: '+1234567890'
      },
      {
        menu_name: 'billing_menu',
        option_key: '1',
        option_text: 'Make a Payment - Get payment instructions',
        action_type: 'message',
        action_value: 'To make a payment, please visit our website or call 1-800-PAYMENT'
      },
      {
        menu_name: 'billing_menu',
        option_key: '2',
        option_text: 'Billing Support - Speak with billing representative',
        action_type: 'transfer',
        action_value: '+1234567890'
      }
    ];
    
    // Insert sample options
    for (const option of sampleOptions) {
      try {
        const query = `
          INSERT INTO menu_options (menu_name, option_key, option_text, action_type, action_value)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          option_text = VALUES(option_text),
          action_type = VALUES(action_type),
          action_value = VALUES(action_value)
        `;
        
        const values = [
          option.menu_name,
          option.option_key,
          option.option_text,
          option.action_type,
          option.action_value
        ];
        
        await connection.execute(query, values);
        console.log(`✅ Added menu option: ${option.menu_name} - ${option.option_key}`);
      } catch (error) {
        console.log(`⚠️ Menu option already exists: ${option.menu_name} - ${option.option_key}`);
      }
    }
    
    connection.release();
    console.log('✅ Sample menu options added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample menu options:', error);
    throw error;
  }
}

// Run the initialization
initializeDatabase(); 