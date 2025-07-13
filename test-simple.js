const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSimpleIVR() {
  console.log('🗑️ Testing Simple Waste Management IVR (No Database)...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test calls endpoint (should be empty initially)
    console.log('\n2. Testing calls endpoint...');
    const callsResponse = await axios.get(`${BASE_URL}/api/calls`);
    console.log('✅ Calls endpoint working:', callsResponse.data.total, 'calls stored');

    console.log('\n🎉 Simple IVR System is ready for Twilio testing!');
    console.log('\n📞 Call Flow:');
    console.log('   1. Welcome message');
    console.log('   2. Language selection (1=English, 2=Spanish, 3=French)');
    console.log('   3. House number input');
    console.log('   4. Service rating (1-5)');
    console.log('   5. Thank you message');
    console.log('\n🔗 Twilio webhook URL: http://localhost:3000/api/twilio/voice');
    console.log('📊 View calls: http://localhost:3000/api/calls');
    console.log('🗑️ Clear calls: DELETE http://localhost:3000/api/calls');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running: npm start');
    }
  }
}

// Run the tests
testSimpleIVR(); 