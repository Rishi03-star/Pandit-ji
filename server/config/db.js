const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Supports local MongoDB instance or MongoDB Atlas via MONGO_URI environment variable
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pandit_booking_db';
    
    const conn = await mongoose.connect(mongoURI, {
      // Modern mongoose options are enabled by default
    });

    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error('👉 Please make sure your MongoDB service is running locally, or verify your MONGO_URI in server/.env');
    // We don't necessarily exit the process immediately in dev mode to allow health check diagnostics
    return null;
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ [Database] MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 [Database] MongoDB reconnected');
});

module.exports = connectDB;
