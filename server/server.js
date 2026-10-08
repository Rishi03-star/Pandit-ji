const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const priestRoutes = require('./routes/priestRoutes');
const ritualRoutes = require('./routes/ritualRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const seedRoutes = require('./routes/seedRoutes');
const Ritual = require('./models/Ritual');
const { seedDatabase } = require('./controllers/seedController');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async (conn) => {
  if (conn) {
    try {
      const ritualCount = await Ritual.countDocuments();
      if (ritualCount === 0) {
        console.log('🌱 [Auto-Seed] Empty database detected. Seeding authentic Vedic rituals & priests...');
        // Mock request & response for seeder
        await seedDatabase({ body: {} }, {
          json: (data) => console.log('✅ [Auto-Seed Completed]:', data.message),
          status: () => ({ json: (err) => console.error('❌ [Auto-Seed Error]:', err) })
        });
      }
    } catch (err) {
      console.warn('⚠️ [Auto-Seed Check]:', err.message);
    }
  }
});

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or any client domain
    if (!origin || process.env.NODE_ENV === 'development' || !process.env.CLIENT_URL || origin === process.env.CLIENT_URL || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in production for API consumer clients
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded assets statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Pandit Ji at Your Doorstep API (Priest Booking Platform)',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      priests: '/api/priests',
      rituals: '/api/rituals',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      seed: '/api/seed',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    success: true,
    message: 'Pandit Ji API Server is operational',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatusMap[dbState] || 'Unknown',
        connected: dbState === 1,
      },
    },
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/priests', priestRoutes);
app.use('/api/rituals', ritualRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/seed', seedRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 [Server] Server running in ${process.env.NODE_ENV || 'development'} mode on port http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`💥 [Unhandled Rejection]: ${err.message}`);
});

module.exports = app;
