const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getPriestBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/priest-bookings', protect, getPriestBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
