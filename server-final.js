const express = require('express');
const cors = require('cors');
const { VoiceResponse } = require('twilio').twiml;
const { AppwriteService } = require('./config/appwrite-simple');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for testing
const callData = new Map();

// Initialize Appwrite service
const appwriteService = new AppwriteService();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Waste Management IVR System is running',
    timestamp: new Date().toISOString()
  });
});

// Main voice webhook - handles incoming calls
app.post('/api/twilio/voice', (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, From, To, CallStatus } = req.body;

    console.log(`📞 Incoming call from ${From} to ${To}`);

    // Initialize call data
    callData.set(CallSid, {
      callSid: CallSid,
      fromNumber: From,
      toNumber: To,
      callStatus: CallStatus,
      language: null,
      wasteManagementNumber: null,
      rating: null,
      createdAt: new Date()
    });

    // Welcome message for waste management
    twiml.say({
      voice: 'alice',
      language: 'en-US'
    }, 'Welcome to Waste Management Services. Please listen carefully to the following questions.');

    // Start with language selection
    const gather = twiml.gather({
      input: 'dtmf',
      timeout: 10,
      numDigits: 1,
      action: '/api/twilio/language-selection',
      method: 'POST'
    });

    // Play language selection prompt in English
    gather.say({
      voice: 'alice',
      language: 'en-US'
    }, 'Select language: Press 1 for English, 2 for Hindi, 3 for Tamil, 4 for Kannada.');

    // If no input is received, repeat the question
    twiml.say({
      voice: 'alice',
      language: 'en-US'
    }, 'We didn\'t receive any input. Please try again.');

    twiml.redirect('/api/twilio/voice');

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in voice webhook:', error);
    res.status(500).send('Error processing call');
  }
});

// Language selection handler
app.post('/api/twilio/language-selection', (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, Digits } = req.body;

    console.log(`🌐 Language selection: ${Digits} for call ${CallSid}`);

    let language = 'English';
    let languageCode = 'en-US';

    switch (Digits) {
      case '1':
        language = 'English';
        languageCode = 'en-US';
        break;
      case '2':
        language = 'Hindi';
        languageCode = 'en-IN';
        break;
      case '3':
        language = 'Tamil';
        languageCode = 'en-US';
        break;
      case '4':
        language = 'Kannada';
        languageCode = 'en-US';
        break;
      default:
        twiml.say({
          voice: 'alice',
          language: 'en-US'
        }, 'Invalid selection. Please try again.');
        twiml.redirect('/api/twilio/voice');
        res.type('text/xml');
        res.send(twiml.toString());
        return;
    }

    // Store language selection
    const callInfo = callData.get(CallSid);
    if (callInfo) {
      callInfo.language = language;
      callData.set(CallSid, callInfo);
    }

    console.log(`✅ Language selected: ${language} for call ${CallSid}`);

    // Ask for waste management number
    const gather = twiml.gather({
      input: 'dtmf',
      timeout: 12,
      numDigits: 10,
      action: '/api/twilio/house-number',
      method: 'POST'
    });

    // Use text-to-speech for all languages
    gather.say({
      voice: 'alice',
      language: languageCode
    }, 'Please enter your waste management number using the keypad.');

    // If no input is received, repeat the question
    twiml.say({
      voice: 'alice',
      language: languageCode
    }, 'We didn\'t receive any input. Please try again.');
    twiml.redirect('/api/twilio/language-selection');

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in language selection:', error);
    res.status(500).send('Error processing language selection');
  }
});

// Waste management number handler
app.post('/api/twilio/house-number', async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, Digits } = req.body;

    console.log(`🗑️ Waste management number: ${Digits} for call ${CallSid}`);

    // Store waste management number
    const callInfo = callData.get(CallSid);
    if (callInfo) {
      callInfo.wasteManagementNumber = Digits;
      callData.set(CallSid, callInfo);
    }

    console.log(`✅ Waste management number stored: ${Digits} for call ${CallSid}`);

    // Try to get user from Appwrite database
    let userData = null;
    try {
      userData = await appwriteService.getUserByHouseNumber(Digits);
      if (userData) {
        console.log(`✅ User found in database: ${userData.username}`);
      }
    } catch (error) {
      console.log('⚠️ Could not fetch user from database:', error.message);
    }

    // Ask for rating
    const gather = twiml.gather({
      input: 'dtmf',
      timeout: 8,
      numDigits: 1,
      action: '/api/twilio/rating',
      method: 'POST'
    });

    // Get the language from call data
    const currentCallInfo = callData.get(CallSid);
    const selectedLanguage = currentCallInfo ? currentCallInfo.language : 'English';
    const languageCode = selectedLanguage === 'Hindi' ? 'en-IN' : 'en-US';
    
    // Use text-to-speech for rating prompt
    gather.say({
      voice: 'alice',
      language: languageCode
    }, 'Please rate our waste management service. Press 1 for poor, 2 for fair, 3 for good, 4 for very good, or 5 for excellent.');

    // If no input is received, repeat the question
    twiml.say({
      voice: 'alice',
      language: languageCode
    }, 'We didn\'t receive any input. Please try again.');
    twiml.redirect('/api/twilio/house-number');

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in house number handler:', error);
    res.status(500).send('Error processing house number');
  }
});

// Rating handler
app.post('/api/twilio/rating', async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, Digits } = req.body;

    console.log(`⭐ Rating: ${Digits} for call ${CallSid}`);

    let ratingText = '';
    switch (Digits) {
      case '1':
        ratingText = 'poor';
        break;
      case '2':
        ratingText = 'fair';
        break;
      case '3':
        ratingText = 'good';
        break;
      case '4':
        ratingText = 'very good';
        break;
      case '5':
        ratingText = 'excellent';
        break;
      default:
        twiml.say({
          voice: 'alice',
          language: 'en-US'
        }, 'Invalid rating. Please try again.');
        twiml.redirect('/api/twilio/house-number');
        res.type('text/xml');
        res.send(twiml.toString());
        return;
    }

    // Store rating
    const callInfo = callData.get(CallSid);
    if (callInfo) {
      callInfo.rating = parseInt(Digits);
      callInfo.ratingText = ratingText;
      callData.set(CallSid, callInfo);
    }

    console.log(`✅ Rating stored: ${ratingText} (${Digits}) for call ${CallSid}`);

    // Try to save rating to Appwrite database
    if (parseInt(Digits) > 0 && parseInt(Digits) <= 5) {
      try {
        const wasteNumber = callInfo?.wasteManagementNumber;
        if (wasteNumber) {
          await appwriteService.processIVRCall(wasteNumber, parseInt(Digits));
          console.log('✅ Rating saved to database');
        }
      } catch (error) {
        console.log('⚠️ Could not save rating to database:', error.message);
      }
    }

    // Get the language for thank you message
    const finalCallInfo = callData.get(CallSid);
    const finalLanguage = finalCallInfo ? finalCallInfo.language : 'English';
    const finalLanguageCode = finalLanguage === 'Hindi' ? 'en-IN' : 'en-US';
    
    // Use text-to-speech for thank you message
    twiml.say({
      voice: 'alice',
      language: finalLanguageCode
    }, 'Thank you for your feedback. Your rating has been recorded. Have a great day!');

    twiml.hangup();

    // Log complete call data
    console.log('📊 Complete call data:', callData.get(CallSid));

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in rating handler:', error);
    res.status(500).send('Error processing rating');
  }
});

// Call status callback
app.post('/api/twilio/call-status', (req, res) => {
  try {
    const { CallSid, CallStatus, CallDuration } = req.body;

    console.log(`📊 Call status update: ${CallSid} - ${CallStatus}`);

    // Update call status in memory
    const callInfo = callData.get(CallSid);
    if (callInfo) {
      callInfo.callStatus = CallStatus;
      callInfo.callDuration = CallDuration;
      callData.set(CallSid, callInfo);
    }

    res.status(200).send('Status updated');
  } catch (error) {
    console.error('Error in call status callback:', error);
    res.status(500).send('Error updating call status');
  }
});

// API endpoint to view stored call data
app.get('/api/calls', (req, res) => {
  try {
    const calls = Array.from(callData.values());
    res.json({
      success: true,
      data: calls,
      total: calls.length
    });
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calls'
    });
  }
});

// API endpoint to view specific call
app.get('/api/calls/:callSid', (req, res) => {
  try {
    const { callSid } = req.params;
    const call = callData.get(callSid);
    
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

// Clear all call data (for testing)
app.delete('/api/calls', (req, res) => {
  try {
    callData.clear();
    res.json({
      success: true,
      message: 'All call data cleared'
    });
  } catch (error) {
    console.error('Error clearing calls:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear calls'
    });
  }
});

// Start server
async function startServer() {
  try {
    // Check Appwrite connection (optional - won't fail if no API key)
    console.log('🔧 Checking Appwrite connection...');
    try {
      await appwriteService.checkDatabase();
      console.log('✅ Appwrite database connected');
    } catch (error) {
      console.log('⚠️ Appwrite not available (will use in-memory storage):', error.message);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Waste Management IVR Server (Final) running on port ${PORT}`);
      console.log(`📞 Twilio webhook URL: http://localhost:${PORT}/api/twilio/voice`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 View calls: http://localhost:${PORT}/api/calls`);
      console.log(`\n💡 For local testing with Twilio:`);
      console.log(`   1. Install ngrok: npm install -g ngrok`);
      console.log(`   2. Start tunnel: ngrok http ${PORT}`);
      console.log(`   3. Use ngrok URL in Twilio webhook configuration`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 