const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing IVR System API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test database connection
    console.log('\n2. Testing database connection...');
    const dbTestResponse = await axios.get(`${BASE_URL}/api/database/test`);
    console.log('✅ Database test:', dbTestResponse.data);

    // Test call statistics
    console.log('\n3. Testing call statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/api/calls/stats`);
    console.log('✅ Call stats:', statsResponse.data);

    // Test getting calls
    console.log('\n4. Testing get calls...');
    const callsResponse = await axios.get(`${BASE_URL}/api/calls?limit=5`);
    console.log('✅ Calls retrieved:', callsResponse.data.data.length, 'calls');

    // Test menu options
    console.log('\n5. Testing menu options...');
    const menuResponse = await axios.get(`${BASE_URL}/api/database/menu-options`);
    console.log('✅ Menu options:', menuResponse.data.data.length, 'options');

    // Test database stats
    console.log('\n6. Testing database statistics...');
    const dbStatsResponse = await axios.get(`${BASE_URL}/api/database/stats`);
    console.log('✅ Database stats:', dbStatsResponse.data.data);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📞 Your IVR system is ready to receive calls!');
    console.log('🔗 Twilio webhook URL: http://localhost:3000/api/twilio/voice');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running: npm start');
    }
  }
}

// Run the tests
testAPI(); 