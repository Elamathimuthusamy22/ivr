const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testWasteManagementAPI() {
  console.log('🗑️ Testing Waste Management IVR System...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test database connection
    console.log('\n2. Testing database connection...');
    const dbTestResponse = await axios.get(`${BASE_URL}/api/database/test`);
    console.log('✅ Database test:', dbTestResponse.data.message);

    // Test waste management statistics
    console.log('\n3. Testing waste management statistics...');
    const wasteStatsResponse = await axios.get(`${BASE_URL}/api/calls/waste-management-stats`);
    console.log('✅ Waste management stats retrieved');
    console.log('   - Language distribution:', wasteStatsResponse.data.data.languageDistribution.length, 'languages');
    console.log('   - Rating distribution:', wasteStatsResponse.data.data.ratingDistribution.length, 'rating levels');
    console.log('   - Average rating:', wasteStatsResponse.data.data.averageRating.avg_rating || 'No ratings yet');
    console.log('   - Top house numbers:', wasteStatsResponse.data.data.topHouseNumbers.length, 'entries');

    // Test getting calls
    console.log('\n4. Testing get calls...');
    const callsResponse = await axios.get(`${BASE_URL}/api/calls?limit=5`);
    console.log('✅ Calls retrieved:', callsResponse.data.data.length, 'calls');

    console.log('\n🎉 Waste Management IVR System is ready!');
    console.log('\n📞 Call Flow:');
    console.log('   1. Welcome message');
    console.log('   2. Language selection (1=English, 2=Spanish, 3=French)');
    console.log('   3. House number input');
    console.log('   4. Service rating (1-5)');
    console.log('   5. Thank you message');
    console.log('\n🔗 Twilio webhook URL: http://localhost:3000/api/twilio/voice');
    console.log('📊 Analytics URL: http://localhost:3000/api/calls/waste-management-stats');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running: npm start');
    }
  }
}

// Run the tests
testWasteManagementAPI(); 