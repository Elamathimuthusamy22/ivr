#!/usr/bin/env node

const { AppwriteService } = require('../config/appwrite');
require('dotenv').config();

async function setupAppwrite() {
  console.log('🚀 Setting up Appwrite for IVR System...\n');

  // Check if required environment variables are set
  const requiredEnvVars = [
    'APPWRITE_PROJECT_ID',
    'APPWRITE_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.log('\n📝 Please add these to your .env file:');
    console.log('APPWRITE_PROJECT_ID=your_project_id');
    console.log('APPWRITE_API_KEY=your_api_key');
    console.log('\n🔗 Get these from your Appwrite console: https://cloud.appwrite.io/console');
    process.exit(1);
  }

  try {
    const appwriteService = new AppwriteService();
    
    console.log('🔧 Checking Appwrite database and collections...');
    await appwriteService.checkDatabase();
    
    console.log('\n✅ Appwrite setup completed successfully!');
    console.log('\n📊 Your IVR system is now configured with:');
    console.log('   - Database: 6872b56a001ef22c036f');
    console.log('   - Collections: user-house, leaderboard_ratings');
    console.log('   - Automatic user lookup by house number');
    console.log('   - Rating storage in leaderboard');
    
    console.log('\n🚀 You can now run your server with:');
    console.log('   node server-appwrite.js');
    
    console.log('\n📞 Test your IVR system by calling your Twilio number!');
    
  } catch (error) {
    console.error('❌ Error setting up Appwrite:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Appwrite project ID is correct');
    console.log('   2. Your API key has the right permissions');
    console.log('   3. You have an active Appwrite account');
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupAppwrite();
}

module.exports = { setupAppwrite }; 