const { Client, Databases, Account } = require('node-appwrite');
require('dotenv').config();

// Appwrite configuration
const appwriteConfig = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: process.env.APPWRITE_DATABASE_ID || 'ivr_database',
  callsCollectionId: process.env.APPWRITE_CALLS_COLLECTION_ID || 'calls',
  usersCollectionId: process.env.APPWRITE_USERS_COLLECTION_ID || 'users'
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setKey(appwriteConfig.apiKey);

// Initialize services
const databases = new Databases(client);
const account = new Account(client);

// Database and collection IDs
const DATABASE_ID = appwriteConfig.databaseId;
const CALLS_COLLECTION_ID = appwriteConfig.callsCollectionId;
const USERS_COLLECTION_ID = appwriteConfig.usersCollectionId;

// Collection schemas
const callsSchema = [
  {
    $id: 'callSid',
    name: 'Call SID',
    type: 'string',
    required: true,
    array: false
  },
  {
    $id: 'fromNumber',
    name: 'From Number',
    type: 'string',
    required: true,
    array: false
  },
  {
    $id: 'toNumber',
    name: 'To Number',
    type: 'string',
    required: true,
    array: false
  },
  {
    $id: 'callStatus',
    name: 'Call Status',
    type: 'string',
    required: true,
    array: false
  },
  {
    $id: 'language',
    name: 'Language',
    type: 'string',
    required: false,
    array: false
  },
  {
    $id: 'wasteManagementNumber',
    name: 'Waste Management Number',
    type: 'string',
    required: false,
    array: false
  },
  {
    $id: 'rating',
    name: 'Rating',
    type: 'integer',
    required: false,
    array: false
  },
  {
    $id: 'ratingText',
    name: 'Rating Text',
    type: 'string',
    required: false,
    array: false
  },
  {
    $id: 'callDuration',
    name: 'Call Duration',
    type: 'integer',
    required: false,
    array: false
  },
  {
    $id: 'createdAt',
    name: 'Created At',
    type: 'datetime',
    required: true,
    array: false
  },
  {
    $id: 'updatedAt',
    name: 'Updated At',
    type: 'datetime',
    required: true,
    array: false
  }
];

const usersSchema = [
  {
    $id: 'phoneNumber',
    name: 'Phone Number',
    type: 'string',
    required: true,
    array: false
  },
  {
    $id: 'name',
    name: 'Name',
    type: 'string',
    required: false,
    array: false
  },
  {
    $id: 'preferredLanguage',
    name: 'Preferred Language',
    type: 'string',
    required: false,
    array: false
  },
  {
    $id: 'wasteManagementNumber',
    name: 'Waste Management Number',
    type: 'string',
    required: false,
    array: false
  },
  {
    $id: 'createdAt',
    name: 'Created At',
    type: 'datetime',
    required: true,
    array: false
  },
  {
    $id: 'updatedAt',
    name: 'Updated At',
    type: 'datetime',
    required: true,
    array: false
  }
];

// Appwrite service functions
class AppwriteService {
  constructor() {
    this.databases = databases;
    this.account = account;
    this.databaseId = DATABASE_ID;
    this.callsCollectionId = CALLS_COLLECTION_ID;
    this.usersCollectionId = USERS_COLLECTION_ID;
  }

  // Check database and collections exist
  async checkDatabase() {
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
    try {
      const documents = await this.databases.listDocuments(
        this.databaseId,
        this.userHouseCollectionId,
        [
          this.databases.queries.equal('houseNo', houseNumber)
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
      throw error;
    }
  }

  // Save rating to leaderboard
  async saveRatingToLeaderboard(userData, rating) {
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
      throw error;
    }
  }

  // Get all ratings from leaderboard
  async getAllRatings() {
    try {
      const documents = await this.databases.listDocuments(
        this.databaseId,
        this.leaderboardRatingsCollectionId,
        [
          this.databases.queries.orderDesc('date')
        ]
      );
      return documents.documents;
    } catch (error) {
      console.error('❌ Error getting ratings:', error);
      throw error;
    }
  }

  // Get ratings by user ID
  async getRatingsByUserId(userId) {
    try {
      const documents = await this.databases.listDocuments(
        this.databaseId,
        this.leaderboardRatingsCollectionId,
        [
          this.databases.queries.equal('userId', userId)
        ]
      );
      return documents.documents;
    } catch (error) {
      console.error('❌ Error getting ratings by user ID:', error);
      throw error;
    }
  }

  // Process IVR call data
  async processIVRCall(wasteManagementNumber, rating) {
    try {
      console.log(`🔄 Processing IVR call - House: ${wasteManagementNumber}, Rating: ${rating}`);
      
      // Step 1: Find user by house number
      const userData = await this.getUserByHouseNumber(wasteManagementNumber);
      
      if (!userData) {
        console.log(`❌ No user found for house number: ${wasteManagementNumber}`);
        return {
          success: false,
          message: 'User not found for this house number'
        };
      }
      
      console.log(`✅ Found user: ${userData.username} (ID: ${userData.userId})`);
      
      // Step 2: Save rating to leaderboard
      await this.saveRatingToLeaderboard(userData, rating);
      
      return {
        success: true,
        message: 'Rating saved successfully',
        userData: userData,
        rating: rating
      };
      
    } catch (error) {
      console.error('❌ Error processing IVR call:', error);
      throw error;
    }
  }
}

module.exports = {
  AppwriteService,
  appwriteConfig
}; 