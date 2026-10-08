const mongoose = require('mongoose');

const ritualSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide ritual name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Pujas & Katha', 'Havans & Yagya', 'Sanskars & Vivah', 'Shanti & Astrological', 'Festive Rituals'],
      default: 'Pujas & Katha',
    },
    shortDescription: {
      type: String,
      required: true,
    },
    detailedSignificance: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    approxDurationMinutes: {
      type: Number,
      default: 120,
    },
    suggestedDakshana: {
      type: Number,
      default: 3100,
    },
    iconName: {
      type: String,
      default: 'Flame',
    },
    image: {
      type: String,
      default: '',
    },
    samagriList: [
      {
        name: { type: String, required: true },
        quantity: { type: String, default: 'Standard' },
        providedBy: { type: String, enum: ['pandit', 'devotee', 'optional'], default: 'pandit' },
      },
    ],
    vidhiSteps: {
      type: [String],
      default: [
        'Aachaman and Sankalpa',
        'Gauri Ganesh & Navgraha Sthapana',
        'Kalash Pujan & Abhishek',
        'Moola Mantra Recitation & Stotras',
        'Havan / Yagya with Ghee and Samidha',
        'Maha Aarti and Shanti Paath',
        'Prasad and Ashirwad Distribution',
      ],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ritual', ritualSchema);
