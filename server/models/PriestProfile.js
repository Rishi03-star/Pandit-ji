const mongoose = require('mongoose');

const ritualOfferingSchema = new mongoose.Schema({
  ritualId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ritual',
  },
  ritualName: {
    type: String,
    required: true,
  },
  dakshana: {
    type: Number,
    required: true,
  },
  durationMinutes: {
    type: Number,
    default: 120,
  },
  samagriIncluded: {
    type: Boolean,
    default: true,
  },
});

const priestProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: 'Acharya', // Acharya, Pandit, Shastri, Vidwan
    },
    vedicLineage: {
      type: String,
      default: 'Shukla Yajurveda Tradition',
    },
    education: {
      type: String,
      default: 'Acharya Degree in Vedic Karmakanda, Sampurnanand Sanskrit Vishwavidyalaya, Varanasi',
    },
    experienceYears: {
      type: Number,
      required: [true, 'Please specify years of Vedic experience'],
      default: 10,
    },
    languages: {
      type: [String],
      default: ['Sanskrit', 'Hindi'],
    },
    specializations: {
      type: [String],
      default: ['Griha Pravesh', 'Satyanarayan Katha', 'Vivah Sanskar', 'Rudrabhishek', 'Maha Mrityunjaya Havan'],
    },
    bio: {
      type: String,
      default: 'Dedicated Vedic priest with deep knowledge of Shastra, Karmakanda, and traditional Sanskrit stotras.',
    },
    city: {
      type: String,
      required: true,
      default: 'Delhi NCR',
    },
    serviceRadiusKm: {
      type: Number,
      default: 25,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 12,
    },
    baseDakshana: {
      type: Number,
      default: 2100,
    },
    ritualsOffered: [ritualOfferingSchema],
    availableSlots: {
      type: [String],
      default: [
        '06:00 AM - 09:00 AM (Brahma Muhurta)',
        '09:00 AM - 12:00 PM (Shubh Abhijit)',
        '03:00 PM - 06:00 PM (Aparahna)',
        '06:00 PM - 09:00 PM (Sandhya Vela)',
      ],
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PriestProfile', priestProfileSchema);
