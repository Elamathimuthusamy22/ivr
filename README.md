# IVR System with Twilio, Express, and MySQL

A complete Interactive Voice Response (IVR) system built with Node.js, Express, Twilio, and MySQL. This system provides a professional IVR solution with call tracking, menu management, and comprehensive analytics.

## 🚀 Features

- **Interactive Voice Response**: Multi-level menu system with DTMF input
- **Call Recording**: Automatic call recording with transcription
- **Call Transfer**: Seamless transfer to live representatives
- **Call Tracking**: Complete call history and analytics
- **Database Storage**: MySQL backend for persistent data storage
- **REST API**: Full API for call management and statistics
- **Menu Management**: Dynamic menu configuration
- **Call Logging**: Detailed event logging for each call
- **Statistics**: Comprehensive call analytics and reporting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Twilio Account with a phone number
- ngrok (for local development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ivr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
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

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE ivr_system;
   ```

5. **Initialize the database**
   ```bash
   npm run init-db
   ```

6. **Start the server**
   ```bash
   npm start
   ```

## 🔧 Twilio Configuration

1. **Get your Twilio credentials**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Copy your Account SID and Auth Token
   - Get a Twilio phone number

2. **Configure webhook URLs**
   - Voice webhook: `https://your-domain.com/api/twilio/voice`
   - SMS webhook: `https://your-domain.com/api/twilio/sms`
   - Status callback: `https://your-domain.com/api/twilio/call-status`

3. **For local development**
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Start ngrok tunnel
   ngrok http 3000
   
   # Use the ngrok URL in your Twilio webhook configuration
   ```

## 📞 IVR Menu Structure

The system includes a comprehensive IVR menu:

```
Main Menu:
├── 1. Customer Support
│   └── Leave voicemail message (with transcription)
├── 2. Sales Information
│   └── 1. Speak with sales representative
├── 3. Billing Inquiries
│   ├── 1. Make a payment
│   └── 2. Speak with billing support
├── 4. Speak with Representative
└── 5. Repeat Menu
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health status

### Call Management
- `GET /api/calls` - Get all calls (with pagination)
- `GET /api/calls/stats` - Get call statistics
- `GET /api/calls/:callSid` - Get specific call details
- `GET /api/calls/:callSid/logs` - Get call event logs
- `GET /api/calls/number/:phoneNumber` - Get calls by phone number
- `GET /api/calls/status/:status` - Get calls by status
- `GET /api/calls/date-range` - Get calls within date range
- `GET /api/calls/menu-stats` - Get menu selection statistics

### Database Management
- `GET /api/database/test` - Test database connection
- `POST /api/database/init` - Initialize database tables
- `GET /api/database/menu-options` - Get menu options
- `POST /api/database/menu-options` - Add menu option
- `PUT /api/database/menu-options/:id` - Update menu option
- `DELETE /api/database/menu-options/:id` - Delete menu option
- `GET /api/database/stats` - Get database statistics

### Twilio Webhooks
- `POST /api/twilio/voice` - Main voice webhook
- `POST /api/twilio/menu` - Menu selection handler
- `POST /api/twilio/sales-transfer` - Sales transfer handler
- `POST /api/twilio/billing-menu` - Billing menu handler
- `POST /api/twilio/record-support` - Support recording handler
- `POST /api/twilio/transcribe` - Transcription callback
- `POST /api/twilio/call-status` - Call status callback
- `POST /api/twilio/sms` - SMS webhook

## 📊 Database Schema

### Calls Table
```sql
CREATE TABLE calls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  call_sid VARCHAR(255) UNIQUE NOT NULL,
  from_number VARCHAR(20) NOT NULL,
  to_number VARCHAR(20) NOT NULL,
  call_status VARCHAR(50) NOT NULL,
  call_duration INT DEFAULT 0,
  recording_url VARCHAR(500),
  transcription TEXT,
  user_input VARCHAR(10),
  menu_selection VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Call Logs Table
```sql
CREATE TABLE call_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  call_sid VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_data JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Menu Options Table
```sql
CREATE TABLE menu_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_name VARCHAR(100) NOT NULL,
  option_key VARCHAR(10) NOT NULL,
  option_text TEXT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  action_value TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 Usage Examples

### Making a Test Call
1. Call your Twilio phone number
2. Listen to the welcome message
3. Press the desired menu option
4. Follow the prompts

### API Usage Examples

**Get call statistics:**
```bash
curl http://localhost:3000/api/calls/stats
```

**Get recent calls:**
```bash
curl http://localhost:3000/api/calls?limit=10&page=1
```

**Get calls by phone number:**
```bash
curl http://localhost:3000/api/calls/number/+1234567890
```

**Add a new menu option:**
```bash
curl -X POST http://localhost:3000/api/database/menu-options \
  -H "Content-Type: application/json" \
  -d '{
    "menuName": "main_menu",
    "optionKey": "6",
    "optionText": "Technical Support",
    "actionType": "transfer",
    "actionValue": "+1234567890"
  }'
```

## 🔧 Customization

### Adding New Menu Options
1. Use the API to add menu options
2. Update the Twilio webhook logic in `routes/twilio.js`
3. Add corresponding handlers for new menu flows

### Modifying Voice Prompts
Edit the text in the `twiml.say()` calls in `routes/twilio.js`

### Changing Transfer Numbers
Update the phone numbers in the `twiml.dial()` calls

## 📈 Monitoring and Analytics

The system provides comprehensive analytics:

- **Call Volume**: Total calls, completed calls, failed calls
- **Call Duration**: Average call duration, total talk time
- **Menu Usage**: Most popular menu selections
- **Call Status**: Distribution of call outcomes
- **Phone Number Analysis**: Call patterns by number

## 🔒 Security Features

- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Secure database connections

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Twilio Webhook Errors**
   - Verify webhook URLs are accessible
   - Check Twilio credentials
   - Ensure proper XML response format

3. **Call Not Routing**
   - Check Twilio phone number configuration
   - Verify webhook URLs in Twilio console
   - Test webhook endpoints manually

### Debug Mode
Set `NODE_ENV=development` in `.env` for detailed error messages.

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Twilio documentation

---

**Built with ❤️ using Node.js, Express, Twilio, and MySQL** 