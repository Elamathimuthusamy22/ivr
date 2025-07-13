const { Client, Databases, Account, Query } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Read env.example file directly
function loadEnvExample() {
  try {
    const envPath = path.join(__dirname, '..', 'env.example');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      let trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        // Remove spaces around '='
        let [key, ...valueParts] = trimmed.split('=');
        key = key.trim();
        let value = valueParts.join('=').trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        envVars[key] = value;
      }
    });

    return envVars;
  } catch (error) {
    console.error('❌ Error reading env.example:', error.message);
    return {};
  }
}

const envVars = loadEnvExample();

// Appwrite configuration
const appwriteConfig = {
  endpoint: envVars.APPWRITE_ENDPOINT,
  projectId: envVars.APPWRITE_PROJECT_ID,
  apiKey: envVars.APPWRITE_API_KEY,
  databaseId: envVars.APPWRITE_DATABASE_ID || 'ivr_database',
  userHouseCollectionId: envVars.APPWRITE_USER_HOUSE_COLLECTION_ID || 'user-house',
  leaderboardRatingsCollectionId: envVars.APPWRITE_LEADERBOARD_RATINGS_COLLECTION_ID || 'leaderboard_ratings'
};

console.log('🔧 Appwrite Configuration:');
console.log('   Endpoint:', appwriteConfig.endpoint);
console.log('   Project ID:', appwriteConfig.projectId);
console.log('   Database ID:', appwriteConfig.databaseId);
console.log('   User House Collection:', appwriteConfig.userHouseCollectionId);
console.log('   Leaderboard Collection:', appwriteConfig.leaderboardRatingsCollectionId);

// Check if we have valid configuration
const hasValidConfig = appwriteConfig.projectId && 
                      appwriteConfig.apiKey && 
                      appwriteConfig.apiKey !== 'your_appwrite_api_key';

let client, databases, account;

if (hasValidConfig) {
  try {
    // Initialize Appwrite client
    client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setKey(appwriteConfig.apiKey);

    // Initialize services
    databases = new Databases(client);
    account = new Account(client);
    
    console.log('✅ Appwrite client initialized successfully');
  } catch (error) {
    console.log('⚠️ Failed to initialize Appwrite client:', error.message);
    client = null;
    databases = null;
    account = null;
  }
} else {
  console.log('⚠️ No valid Appwrite API key found - using in-memory storage only');
  client = null;
  databases = null;
  account = null;
}

// Database and collection IDs
const DATABASE_ID = appwriteConfig.databaseId;
const USER_HOUSE_COLLECTION_ID = appwriteConfig.userHouseCollectionId;
const LEADERBOARD_RATINGS_COLLECTION_ID = appwriteConfig.leaderboardRatingsCollectionId;

// Appwrite service functions
class AppwriteService {
  constructor() {
    this.databases = databases;
    this.account = account;
    this.databaseId = DATABASE_ID;
    this.userHouseCollectionId = USER_HOUSE_COLLECTION_ID;
    this.leaderboardRatingsCollectionId = LEADERBOARD_RATINGS_COLLECTION_ID;
    this.isAvailable = !!(this.databases && this.account);
  }

  // Check if Appwrite is available
  isAppwriteAvailable() {
    return this.isAvailable && this.databases;
  }

  // Check database and collections exist
  async checkDatabase() {
    if (!this.isAppwriteAvailable()) {
      console.log('⚠️ Appwrite not available - skipping database check');
      return false;
    }

    try {
      console.log('🔧 Checking Appwrite database and collections...');
      
      // Check database exists
      try {
        await this.databases.get(this.databaseId);
        console.log('✅ Database exists');
      } catch (error) {
        console.error('❌ Database not found:', error.message);
        throw error;
      }

      // Check user-house collection exists
      try {
        await this.databases.getCollection(this.databaseId, this.userHouseCollectionId);
        console.log('✅ User-house collection exists');
      } catch (error) {
        console.error('❌ User-house collection not found:', error.message);
        throw error;
      }

      // Check leaderboard_ratings collection exists
      try {
        await this.databases.getCollection(this.databaseId, this.leaderboardRatingsCollectionId);
        console.log('✅ Leaderboard ratings collection exists');
      } catch (error) {
        console.error('❌ Leaderboard ratings collection not found:', error.message);
        throw error;
      }

      console.log('🎉 All collections verified!');
      return true;
    } catch (error) {
      console.error('❌ Error checking Appwrite database:', error);
      throw error;
    }
  }

  // Get user by house number (waste management number)
  async getUserByHouseNumber(houseNumber) {
    if (!this.isAppwriteAvailable()) {
      console.log('⚠️ Appwrite not available - returning null for user lookup');
      return null;
    }

    try {
      const documents = await this.databases.listDocuments(
        this.databaseId,
        this.userHouseCollectionId,
        [
          Query.equal('houseNo', houseNumber)
        ]
      );
      
      if (documents.documents.length === 0) {
        console.log(`⚠️ No user found for house number: ${houseNumber}`);
        return null;
      }
      
      console.log(`✅ User found for house number: ${houseNumber}`);
      return documents.documents[0];
    } catch (error) {
      console.error('❌ Error getting user by house number:', error);
      return null; // Return null instead of throwing
    }
  }

  // Save rating to leaderboard
  async saveRatingToLeaderboard(userData, rating) {
    if (!this.isAppwriteAvailable()) {
      console.log('⚠️ Appwrite not available - skipping rating save');
      return null;
    }

    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const ratingData = {
        username: userData.username,
        houseNo: userData.houseNo,
        date: currentDate,
        rating: rating,
        userId: userData.userId
      };

      const document = await this.databases.createDocument(
        this.databaseId,
        this.leaderboardRatingsCollectionId,
        'unique()',
        ratingData
      );
      
      console.log('✅ Rating saved to leaderboard:', document.$id);
      console.log('📊 Rating data:', ratingData);
      return document;
    } catch (error) {
      console.error('❌ Error saving rating to leaderboard:', error);
      return null; // Return null instead of throwing
    }
  }

  // Get all ratings from leaderboard
  async getAllRatings() {
    if (!this.isAppwriteAvailable()) {
      console.log('⚠️ Appwrite not available - returning empty ratings');
      return [];
    }

    try {
      const documents = await this.databases.listDocuments(
        this.databaseId,
        this.leaderboardRatingsCollectionId,
        [
          Query.orderDesc('$createdAt')
        ]
      );
      
      return documents.documents;
    } catch (error) {
      console.error('❌ Error getting all ratings:', error);
      return [];
    }
  }

  // Get all users from user-house collection
  async getAllUsers() {
    if (!this.isAppwriteAvailable()) {
      console.log('⚠️ Appwrite not available - returning empty users');
      return [];
    }

    try {
      const documents = await this.databases.listDocuments(
        this.databaseId,
        this.userHouseCollectionId,
        [
          Query.orderDesc('$createdAt')
        ]
      );
      
      console.log(`📊 Found ${documents.documents.length} users in user-house collection`);
      return documents.documents;
    } catch (error) {
      console.error('❌ Error getting all users:', error);
      return [];
    }
  }

  // Get ratings by user ID
  async getRatingsByUserId(userId) {
    if (!this.isAppwriteAvailable()) {
      console.log('⚠️ Appwrite not available - returning empty ratings');
      return [];
    }

    try {
      const documents = await this.databases.listDocuments(
        this.databaseId,
        this.leaderboardRatingsCollectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      );
      
      return documents.documents;
    } catch (error) {
      console.error('❌ Error getting ratings by user ID:', error);
      return [];
    }
  }

  // Process IVR call - get user and save rating
  async processIVRCall(wasteManagementNumber, rating) {
    if (!this.isAppwriteAvailable()) {
      console.log('⚠️ Appwrite not available - skipping IVR call processing');
      return null;
    }

    try {
      console.log(`📞 Processing IVR call for house ${wasteManagementNumber} with rating ${rating}`);
      
      // Get user by house number
      const userData = await this.getUserByHouseNumber(wasteManagementNumber);
      
      if (!userData) {
        console.log('⚠️ No user found, cannot save rating');
        return null;
      }
      
      // Save rating to leaderboard
      const savedRating = await this.saveRatingToLeaderboard(userData, rating);
      
      console.log('✅ IVR call processed successfully');
      return {
        user: userData,
        rating: savedRating
      };
    } catch (error) {
      console.error('❌ Error processing IVR call:', error);
      return null; // Return null instead of throwing
    }
  }
}

module.exports = { AppwriteService, appwriteConfig }; 