# 🗑️ Waste Management IVR Setup Guide

Quick setup guide to test your waste management IVR system.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
   TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890

   # MySQL Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=ivr_system
   DB_PORT=3306

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE ivr_system;
   ```

4. **Initialize database:**
   ```bash
   npm run init-db
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Test the system:**
   ```bash
   npm run test-waste
   ```

## 📞 Twilio Configuration

1. **Get Twilio credentials:**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Copy Account SID and Auth Token
   - Get a Twilio phone number

2. **Configure webhook URLs:**
   - Voice webhook: `https://your-domain.com/api/twilio/voice`
   - Status callback: `https://your-domain.com/api/twilio/call-status`

3. **For local testing with ngrok:**
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Start ngrok tunnel
   ngrok http 3000
   
   # Use the ngrok URL in Twilio webhook configuration
   # Example: https://abc123.ngrok.io/api/twilio/voice
   ```

## 🎯 Call Flow

When someone calls your Twilio number:

1. **Welcome Message:** "Welcome to Waste Management Services. Please listen carefully to the following questions."

2. **Language Selection:** 
   - Press 1 for English
   - Press 2 for Spanish  
   - Press 3 for French

3. **House Number:** Enter your house number using the keypad

4. **Service Rating:**
   - Press 1 for Poor
   - Press 2 for Fair
   - Press 3 for Good
   - Press 4 for Very Good
   - Press 5 for Excellent

5. **Thank You:** "Thank you for your rating. Your feedback is important to us."

## 📊 Data Storage

All call data is stored in MySQL with these fields:
- `call_sid`: Unique Twilio call identifier
- `from_number`: Caller's phone number
- `language_selected`: User's language choice
- `house_number`: User's house number
- `service_rating`: Rating (1-5)
- `rating_text`: Rating description (poor, fair, good, etc.)
- `created_at`: Call timestamp

## 🔍 Testing

### Test API Endpoints:
```bash
# Health check
curl http://localhost:3000/health

# Waste management statistics
curl http://localhost:3000/api/calls/waste-management-stats

# All calls
curl http://localhost:3000/api/calls

# Database test
curl http://localhost:3000/api/database/test
```

### Test with Real Call:
1. Configure Twilio webhook URLs
2. Call your Twilio number
3. Follow the prompts
4. Check database for stored data

## 📈 Analytics

View waste management analytics at:
- `GET /api/calls/waste-management-stats` - Language distribution, ratings, house numbers
- `GET /api/calls/stats` - General call statistics
- `GET /api/calls` - All call records

## 🐛 Troubleshooting

**Database connection failed:**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

**Twilio webhook errors:**
- Verify webhook URLs are accessible
- Check Twilio credentials
- Test with ngrok for local development

**Call not routing:**
- Check Twilio phone number configuration
- Verify webhook URLs in Twilio console

## 📞 Support

The system is now ready to receive calls and collect waste management feedback! 