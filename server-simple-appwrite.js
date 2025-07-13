const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// In-memory storage for calls and data
const calls = [];
const users = [
  { houseNo: '1001', username: 'John Doe', userId: 'user1' },
  { houseNo: '1002', username: 'Jane Smith', userId: 'user2' },
  { houseNo: '1003', username: 'Bob Johnson', userId: 'user3' },
  { houseNo: '1004', username: 'Alice Brown', userId: 'user4' },
  { houseNo: '1005', username: 'Charlie Wilson', userId: 'user5' }
];
const ratings = [];

// Twilio webhook for voice calls
app.post('/api/twilio/voice', async (req, res) => {
  try {
    const { From, To, CallSid } = req.body;
    
    console.log(`📞 Incoming call from ${From} to ${To}`);
    
    // Store call info
    calls.push({
      callSid: CallSid,
      from: From,
      to: To,
      timestamp: new Date().toISOString(),
      status: 'incoming'
    });

    // Create TwiML response
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Welcome message with language selection
    const gather = twiml.gather({
      input: 'dtmf',
      timeout: 10,
      numDigits: 1,
      action: '/api/twilio/language-selection',
      method: 'POST'
    }, (gatherNode) => {
      gatherNode.say('Welcome to the Waste Management IVR System. Press 1 for English, 2 for Hindi, 3 for Tamil, 4 for Kannada.');
    });

    // If no input, repeat the message
    twiml.say('Please select your language. Press 1 for English, 2 for Hindi, 3 for Tamil, 4 for Kannada.');

    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error handling incoming call:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error. Please try again later.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Language selection handler
app.post('/api/twilio/language-selection', async (req, res) => {
  try {
    const { From, To, CallSid, Digits } = req.body;
    
    console.log(`🌍 Language selection: ${Digits} for call ${CallSid}`);
    
    const languages = {
      '1': { name: 'English' },
      '2': { name: 'Hindi' },
      '3': { name: 'Tamil' },
      '4': { name: 'Kannada' }
    };

    const selectedLanguage = languages[Digits] || languages['1'];
    
    // Update call info
    const callIndex = calls.findIndex(call => call.callSid === CallSid);
    if (callIndex !== -1) {
      calls[callIndex].language = selectedLanguage.name;
    }

    const twiml = new twilio.twiml.VoiceResponse();
    
    // Ask for waste management number
    const gather = twiml.gather({
      input: 'dtmf',
      timeout: 15,
      numDigits: 4,
      action: '/api/twilio/waste-number',
      method: 'POST'
    }, (gatherNode) => {
      gatherNode.say(`You selected ${selectedLanguage.name}. Please enter your 4-digit waste management number.`);
    });

    // If no input, repeat
    twiml.say('Please enter your 4-digit waste management number.');

    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error handling language selection:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error. Please try again later.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Waste management number handler
app.post('/api/twilio/waste-number', async (req, res) => {
  try {
    const { From, To, CallSid, Digits } = req.body;
    
    console.log(`🏠 Waste management number: ${Digits} for call ${CallSid}`);
    
    if (!Digits || Digits.length !== 4) {
      const twiml = new twilio.twiml.VoiceResponse();
      twiml.say('Invalid number. Please enter a 4-digit waste management number.');
      twiml.redirect('/api/twilio/language-selection');
      res.type('text/xml');
      res.send(twiml.toString());
      return;
    }

    // Update call info
    const callIndex = calls.findIndex(call => call.callSid === CallSid);
    if (callIndex !== -1) {
      calls[callIndex].wasteManagementNumber = Digits;
    }

    // Get user from in-memory data
    const userData = users.find(user => user.houseNo === Digits);

    const twiml = new twilio.twiml.VoiceResponse();
    
    if (userData) {
      twiml.say(`Welcome ${userData.username}. Your house number is ${userData.houseNo}.`);
    } else {
      twiml.say(`Thank you for calling. Your waste management number is ${Digits}.`);
    }

    // Ask for rating
    const gather = twiml.gather({
      input: 'dtmf',
      timeout: 10,
      numDigits: 1,
      action: '/api/twilio/rating',
      method: 'POST'
    }, (gatherNode) => {
      gatherNode.say('Please rate our waste management service. Press 1 for poor, 2 for fair, 3 for good, 4 for very good, 5 for excellent.');
    });

    // If no input, repeat
    twiml.say('Please rate our waste management service. Press 1 for poor, 2 for fair, 3 for good, 4 for very good, 5 for excellent.');

    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error handling waste number:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error. Please try again later.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Rating handler
app.post('/api/twilio/rating', async (req, res) => {
  try {
    const { From, To, CallSid, Digits } = req.body;
    
    console.log(`⭐ Rating: ${Digits} for call ${CallSid}`);
    
    const ratings = {
      '1': 'poor',
      '2': 'fair', 
      '3': 'good',
      '4': 'very good',
      '5': 'excellent'
    };

    const ratingText = ratings[Digits] || 'unknown';
    const ratingValue = parseInt(Digits) || 0;
    
    // Update call info
    const callIndex = calls.findIndex(call => call.callSid === CallSid);
    if (callIndex !== -1) {
      calls[callIndex].rating = ratingValue;
      calls[callIndex].ratingText = ratingText;
      calls[callIndex].status = 'completed';
    }

    // Save rating to in-memory storage
    if (ratingValue > 0 && ratingValue <= 5) {
      const wasteNumber = calls[callIndex]?.wasteManagementNumber;
      const userData = users.find(user => user.houseNo === wasteNumber);
      
      if (userData) {
        const currentDate = new Date().toISOString().split('T')[0];
        const ratingData = {
          id: Date.now().toString(),
          username: userData.username,
          houseNo: userData.houseNo,
          date: currentDate,
          rating: ratingValue,
          ratingText: ratingText,
          userId: userData.userId,
          timestamp: new Date().toISOString()
        };
        
        ratings.push(ratingData);
        console.log('✅ Rating saved:', ratingData);
      }
    }

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(`Thank you for your rating of ${ratingText}. Your feedback helps us improve our service. Have a great day!`);
    twiml.hangup();

    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error handling rating:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Thank you for your feedback. Have a great day!');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Waste Management IVR (Simple)',
    version: '1.0.0'
  });
});

// View all calls (for debugging)
app.get('/api/calls', (req, res) => {
  res.json({
    total: calls.length,
    calls: calls
  });
});

// View all ratings (for debugging)
app.get('/api/ratings', (req, res) => {
  res.json({
    total: ratings.length,
    ratings: ratings
  });
});

// View all users (for debugging)
app.get('/api/users', (req, res) => {
  res.json({
    total: users.length,
    users: users
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Waste Management IVR Server (Simple) running on port ${port}`);
  console.log(`📞 Twilio webhook URL: http://localhost:${port}/api/twilio/voice`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`📊 View calls: http://localhost:${port}/api/calls`);
  console.log(`⭐ View ratings: http://localhost:${port}/api/ratings`);
  console.log(`👥 View users: http://localhost:${port}/api/users`);
  console.log('💡 For local testing with Twilio:');
  console.log('   1. Install ngrok: npm install -g ngrok');
  console.log('   2. Start tunnel: ngrok http ' + port);
  console.log('   3. Use ngrok URL in Twilio webhook configuration');
  console.log('');
  console.log('📋 Sample house numbers for testing:');
  users.forEach(user => {
    console.log(`   ${user.houseNo} - ${user.username}`);
  });
}); 