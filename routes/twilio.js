const express = require('express');
const { VoiceResponse, MessagingResponse } = require('twilio').twiml;
const router = express.Router();
const Call = require('../models/Call');

// Main voice webhook - handles incoming calls
router.post('/voice', async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, From, To, CallStatus } = req.body;

    console.log(`📞 Incoming call from ${From} to ${To}`);

    // Log the incoming call
    await Call.create({
      callSid: CallSid,
      fromNumber: From,
      toNumber: To,
      callStatus: CallStatus
    });

    await Call.logEvent(CallSid, 'call_started', {
      from: From,
      to: To,
      status: CallStatus
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

    gather.say({
      voice: 'alice',
      language: 'en-US'
    }, 'First, please select your preferred language. Press 1 for English. Press 2 for Spanish. Press 3 for French.');

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
router.post('/language-selection', async (req, res) => {
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
        language = 'Spanish';
        languageCode = 'es-ES';
        break;
      case '3':
        language = 'French';
        languageCode = 'fr-FR';
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

    // Log the language selection
    await Call.update(CallSid, {
      userInput: Digits,
      menuSelection: `language_${language}`,
      languageSelected: language
    });

    await Call.logEvent(CallSid, 'language_selected', {
      language: language,
      languageCode: languageCode,
      digits: Digits
    });

    // Ask for house number
    const gather = twiml.gather({
      input: 'dtmf',
      timeout: 15,
      numDigits: 1,
      action: '/api/twilio/house-number',
      method: 'POST'
    });

    gather.say({
      voice: 'alice',
      language: languageCode
    }, `Thank you for selecting ${language}. Now, please enter your house number using the keypad. For example, if your house number is 123, press 1, 2, 3.`);

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

// House number handler
router.post('/house-number', async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, Digits } = req.body;

    console.log(`🏠 House number: ${Digits} for call ${CallSid}`);

    // Log the house number
    await Call.update(CallSid, {
      userInput: Digits,
      menuSelection: `house_number_${Digits}`,
      houseNumber: Digits
    });

    await Call.logEvent(CallSid, 'house_number_entered', {
      houseNumber: Digits
    });

    // Ask for rating
    const gather = twiml.gather({
      input: 'dtmf',
      timeout: 10,
      numDigits: 1,
      action: '/api/twilio/rating',
      method: 'POST'
    });

    gather.say({
      voice: 'alice',
      language: 'en-US'
    }, `Thank you. Your house number is ${Digits}. Now, please rate our waste management service. Press 1 for poor, 2 for fair, 3 for good, 4 for very good, or 5 for excellent.`);

    // If no input is received, repeat the question
    twiml.say({
      voice: 'alice',
      language: 'en-US'
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
router.post('/rating', async (req, res) => {
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

    // Log the rating
    await Call.update(CallSid, {
      userInput: Digits,
      menuSelection: `rating_${ratingText}`,
      serviceRating: parseInt(Digits),
      ratingText: ratingText
    });

    await Call.logEvent(CallSid, 'rating_submitted', {
      rating: Digits,
      ratingText: ratingText
    });

    // Thank you message and end call
    twiml.say({
      voice: 'alice',
      language: 'en-US'
    }, `Thank you for your rating of ${ratingText}. Your feedback is important to us. Thank you for using Waste Management Services. Have a great day!`);

    twiml.hangup();

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in rating handler:', error);
    res.status(500).send('Error processing rating');
  }
});

// Sales transfer handler
router.post('/sales-transfer', async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, Digits } = req.body;

    if (Digits === '1') {
      twiml.say({
        voice: 'alice',
        language: 'en-US'
      }, 'Transferring you to a sales representative. Please wait.');
      
      twiml.dial({
        action: '/api/twilio/call-status',
        method: 'POST'
      }, '+1234567890'); // Replace with actual sales number
    } else {
      twiml.say({
        voice: 'alice',
        language: 'en-US'
      }, 'Thank you for calling. Have a great day!');
      twiml.hangup();
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in sales transfer:', error);
    res.status(500).send('Error processing transfer');
  }
});

// Billing menu handler
router.post('/billing-menu', async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, Digits } = req.body;

    if (Digits === '1') {
      twiml.say({
        voice: 'alice',
        language: 'en-US'
      }, 'To make a payment, please visit our website or call our payment line at 1-800-PAYMENT. Thank you for your business.');
    } else if (Digits === '2') {
      twiml.say({
        voice: 'alice',
        language: 'en-US'
      }, 'Transferring you to billing support. Please wait.');
      
      twiml.dial({
        action: '/api/twilio/call-status',
        method: 'POST'
      }, '+1234567890'); // Replace with actual billing number
    } else {
      twiml.say({
        voice: 'alice',
        language: 'en-US'
      }, 'Invalid selection. Thank you for calling.');
    }

    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in billing menu:', error);
    res.status(500).send('Error processing billing menu');
  }
});

// Support recording handler
router.post('/record-support', async (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const { CallSid, RecordingUrl, RecordingDuration } = req.body;

    console.log(`🎙️ Support message recorded: ${RecordingUrl}`);

    // Update call with recording information
    await Call.update(CallSid, {
      recordingUrl: RecordingUrl,
      callDuration: RecordingDuration
    });

    await Call.logEvent(CallSid, 'support_message_recorded', {
      recordingUrl: RecordingUrl,
      duration: RecordingDuration
    });

    twiml.say({
      voice: 'alice',
      language: 'en-US'
    }, 'Thank you for your message. Our support team will get back to you within 24 hours. Have a great day!');

    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in support recording:', error);
    res.status(500).send('Error processing recording');
  }
});

// Transcription callback
router.post('/transcribe', async (req, res) => {
  try {
    const { CallSid, TranscriptionText, TranscriptionStatus } = req.body;

    console.log(`📝 Transcription for call ${CallSid}: ${TranscriptionText}`);

    // Update call with transcription
    await Call.update(CallSid, {
      transcription: TranscriptionText
    });

    await Call.logEvent(CallSid, 'transcription_completed', {
      text: TranscriptionText,
      status: TranscriptionStatus
    });

    res.status(200).send('Transcription processed');
  } catch (error) {
    console.error('Error in transcription callback:', error);
    res.status(500).send('Error processing transcription');
  }
});

// Call status callback
router.post('/call-status', async (req, res) => {
  try {
    const { CallSid, CallStatus, CallDuration } = req.body;

    console.log(`📊 Call status update: ${CallSid} - ${CallStatus}`);

    // Update call status
    await Call.update(CallSid, {
      callStatus: CallStatus,
      callDuration: CallDuration
    });

    await Call.logEvent(CallSid, 'call_status_update', {
      status: CallStatus,
      duration: CallDuration
    });

    res.status(200).send('Status updated');
  } catch (error) {
    console.error('Error in call status callback:', error);
    res.status(500).send('Error updating call status');
  }
});

// SMS webhook (optional)
router.post('/sms', async (req, res) => {
  try {
    const twiml = new MessagingResponse();
    const { From, Body } = req.body;

    console.log(`💬 SMS from ${From}: ${Body}`);

    twiml.message('Thank you for your message. Our team will respond shortly.');

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in SMS webhook:', error);
    res.status(500).send('Error processing SMS');
  }
});

module.exports = router; 