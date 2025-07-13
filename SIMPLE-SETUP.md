# 🗑️ Simple Waste Management IVR Setup (No Database)

Quick setup to test Twilio calls without database setup.

## 🚀 Quick Start (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install express twilio dotenv cors
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with just Twilio credentials:
   ```env
   # Twilio Configuration (only these are needed)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
   TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   node server-simple.js
   ```

4. **Test the system:**
   ```bash
   node test-simple.js
   ```

## 📞 Twilio Setup

1. **Get Twilio credentials:**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Copy Account SID and Auth Token
   - Get a Twilio phone number

2. **For local testing with ngrok:**
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Start ngrok tunnel
   ngrok http 3000
   
   # Copy the ngrok URL (e.g., https://abc123.ngrok.io)
   ```

3. **Configure Twilio webhook:**
   - Go to your Twilio phone number settings
   - Set Voice webhook URL to: `https://your-ngrok-url/api/twilio/voice`
   - Set Status callback URL to: `https://your-ngrok-url/api/twilio/call-status`

## 🎯 Call Flow

When you call your Twilio number:

1. **Welcome:** "Welcome to Waste Management Services. Please listen carefully to the following questions."

2. **Language:** "First, please select your preferred language. Press 1 for English. Press 2 for Spanish. Press 3 for French."

3. **House Number:** "Now, please enter your house number using the keypad. For example, if your house number is 123, press 1, 2, 3."

4. **Rating:** "Now, please rate our waste management service. Press 1 for poor, 2 for fair, 3 for good, 4 for very good, or 5 for excellent."

5. **Thank You:** "Thank you for your rating. Your feedback is important to us."

## 📊 View Data

- **All calls:** `GET http://localhost:3000/api/calls`
- **Specific call:** `GET http://localhost:3000/api/calls/{callSid}`
- **Clear data:** `DELETE http://localhost:3000/api/calls`
- **Health check:** `GET http://localhost:3000/health`

## 🔍 Testing

### Test with curl:
```bash
# Health check
curl http://localhost:3000/health

# View calls
curl http://localhost:3000/api/calls

# Clear calls
curl -X DELETE http://localhost:3000/api/calls
```

### Test with real call:
1. Configure Twilio webhook URLs
2. Call your Twilio number
3. Follow the prompts
4. Check console logs and API endpoints

## 📝 Console Output

The server will show detailed logs:
```
📞 Incoming call from +1234567890 to +0987654321
🌐 Language selection: 1 for call CA123...
✅ Language selected: English for call CA123...
🏠 House number: 123 for call CA123...
✅ House number stored: 123 for call CA123...
⭐ Rating: 5 for call CA123...
✅ Rating stored: excellent (5) for call CA123...
📊 Complete call data: { callSid: 'CA123...', language: 'English', houseNumber: '123', rating: 5, ... }
```

## 🎉 Ready to Test!

That's it! No database setup needed. The system stores all data in memory and will work immediately for testing your Twilio calls.

**Next steps:**
1. Call your Twilio number
2. Follow the prompts
3. Check the console output
4. View stored data via API endpoints

The data will be lost when you restart the server, but it's perfect for testing the call flow! 