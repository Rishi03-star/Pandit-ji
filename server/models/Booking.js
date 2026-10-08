const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PriestProfile',
      required: true,
    },
    ritual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ritual',
      required: true,
    },
    ritualName: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Please select a date for the ritual'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please choose an auspicious time slot'],
    },
    devoteeName: {
      type: String,
      required: true,
    },
    devoteePhone: {
      type: String,
      required: true,
    },
    gotra: {
      type: String,
      default: 'Kashyap',
    },
    familyMembers: {
      type: String,
      default: '',
    },
    address: {
      fullAddress: { type: String, required: true },
      city: { type: String, required: true },
      landmark: { type: String, default: '' },
      pinCode: { type: String, default: '' },
    },
    samagriOption: {
      type: String,
      enum: ['by_pandit', 'by_devotee'],
      default: 'by_pandit',
    },
    dakshanaAmount: {
      type: Number,
      required: true,
    },
    samagriCost: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid_online', 'dakshana_on_ritual'],
      default: 'dakshana_on_ritual',
    },
    specialInstructions: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
