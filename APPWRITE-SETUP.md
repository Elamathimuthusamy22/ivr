# Appwrite Setup Guide for IVR System

This guide will help you set up Appwrite database and services for your IVR system.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Appwrite Account
1. Go to [Appwrite Console](https://cloud.appwrite.io/console)
2. Create a new account or sign in
3. Create a new project
4. Get your Project ID and API Key

### 3. Configure Environment Variables
Copy your `.env.example` to `.env` and add your Appwrite credentials:

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
APPWRITE_DATABASE_ID=ivr_database
APPWRITE_CALLS_COLLECTION_ID=calls
APPWRITE_USERS_COLLECTION_ID=users
```

### 4. Initialize Appwrite Database
```bash
npm run setup-appwrite
```

### 5. Start the Server
```bash
npm run start-appwrite
```

## 📊 Database Schema

### Calls Collection
Stores all IVR call data:

| Field | Type | Description |
|-------|------|-------------|
| callSid | String | Unique Twilio call identifier |
| fromNumber | String | Caller's phone number |
| toNumber | String | Called phone number |
| callStatus | String | Current call status |
| language | String | Selected language (English/Hindi/Tamil/Kannada) |
| wasteManagementNumber | String | User's waste management number |
| rating | Integer | User's rating (1-5) |
| ratingText | String | Rating description (poor/fair/good/very good/excellent) |
| callDuration | Integer | Call duration in seconds |
| createdAt | DateTime | Call creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Users Collection
Stores user information:

| Field | Type | Description |
|-------|------|-------------|
| phoneNumber | String | User's phone number |
| name | String | User's name (optional) |
| preferredLanguage | String | User's preferred language |
| wasteManagementNumber | String | User's waste management number |
| createdAt | DateTime | User creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## 🔧 API Endpoints

### IVR Endpoints
- `POST /api/twilio/voice` - Main call handler
- `POST /api/twilio/language-selection` - Language selection
- `POST /api/twilio/house-number` - Waste management number input
- `POST /api/twilio/rating` - Rating input
- `POST /api/twilio/call-status` - Call status updates

### Data Endpoints
- `GET /api/calls` - Get all calls
- `GET /api/calls/:callSid` - Get specific call
- `GET /api/users/:phoneNumber` - Get user by phone number
- `POST /api/users` - Create/update user

### Utility Endpoints
- `GET /health` - Health check

## 🛠️ Available Scripts

```bash
# Start servers
npm start                    # Start with in-memory storage
npm run start-appwrite      # Start with Appwrite database

# Development
npm run dev                 # Dev mode with in-memory storage
npm run dev-appwrite        # Dev mode with Appwrite database

# Setup
npm run setup-appwrite      # Initialize Appwrite database
npm run init-db             # Initialize MySQL database (legacy)

# Testing
npm test                    # Run API tests
npm run test-waste          # Run waste management tests
```

## 🔐 Security & Permissions

### Appwrite API Key Permissions
Your API key needs the following permissions:
- **Databases**: Read, Write, Create
- **Collections**: Read, Write, Create
- **Attributes**: Read, Write, Create

### Environment Variables Security
- Never commit your `.env` file to version control
- Use different API keys for development and production
- Regularly rotate your API keys

## 📈 Monitoring & Analytics

### Appwrite Console
- Monitor database usage in Appwrite Console
- View real-time data in Collections
- Set up alerts for high usage

### Application Logs
The server logs all important events:
- Incoming calls
- Language selections
- Data updates
- Errors and exceptions

## 🔄 Migration from In-Memory Storage

If you're migrating from the in-memory version:

1. **Backup existing data** (if any)
2. **Set up Appwrite** following this guide
3. **Update your Twilio webhook** to point to the new server
4. **Test thoroughly** before going live

## 🚨 Troubleshooting

### Common Issues

**1. "Missing required environment variables"**
- Check your `.env` file
- Ensure all Appwrite variables are set

**2. "Permission denied"**
- Verify your API key has correct permissions
- Check if your project is active

**3. "Database not found"**
- Run `npm run setup-appwrite` to initialize
- Check your database ID in environment variables

**4. "Collection not found"**
- The setup script should create collections automatically
- Check Appwrite Console for collection status

### Getting Help
- Check Appwrite documentation: https://appwrite.io/docs
- Review server logs for detailed error messages
- Ensure all environment variables are correctly set

## 🎯 Next Steps

After setup, you can:
1. **Customize the database schema** in `config/appwrite.js`
2. **Add more API endpoints** for advanced features
3. **Implement real-time updates** using Appwrite's real-time features
4. **Set up data analytics** and reporting
5. **Add user authentication** using Appwrite Auth

## 📞 Support

For issues with:
- **Appwrite**: Check [Appwrite Documentation](https://appwrite.io/docs)
- **IVR System**: Review the code and logs
- **Twilio Integration**: Check [Twilio Documentation](https://www.twilio.com/docs) 