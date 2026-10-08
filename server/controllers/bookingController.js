const Booking = require('../models/Booking');
const PriestProfile = require('../models/PriestProfile');
const Ritual = require('../models/Ritual');

/**
 * @desc    Create new ritual booking with double-booking slot protection
 * @route   POST /api/bookings
 * @access  Private (Devotee/User)
 */
exports.createBooking = async (req, res) => {
  try {
    const {
      priestId,
      ritualId,
      bookingDate,
      timeSlot,
      devoteeName,
      devoteePhone,
      gotra,
      familyMembers,
      fullAddress,
      city,
      landmark,
      pinCode,
      samagriOption,
      specialInstructions,
    } = req.body;

    // Check if priest exists
    const priest = await PriestProfile.findById(priestId).populate('user', 'name');
    if (!priest) {
      return res.status(404).json({ success: false, message: 'Selected Priest not found' });
    }

    // Check if ritual exists
    const ritual = await Ritual.findById(ritualId);
    if (!ritual) {
      return res.status(404).json({ success: false, message: 'Selected Ritual not found' });
    }

    // Double Booking Prevention: Check if the priest already has a confirmed/pending booking for that slot
    const targetDate = new Date(bookingDate);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingBooking = await Booking.findOne({
      priest: priestId,
      bookingDate: { $gte: targetDate, $lt: nextDay },
      timeSlot: timeSlot,
      status: { $in: ['confirmed', 'in_progress'] },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `Acharya Ji is already booked for ${timeSlot} on this date. Please select another auspicious time slot or date.`,
      });
    }

    // Calculate dakshana & samagri cost
    const customOffering = priest.ritualsOffered?.find(
      (r) => r.ritualName?.toLowerCase() === ritual.name?.toLowerCase()
    );
    const dakshanaAmount = customOffering?.dakshana || ritual.suggestedDakshana || priest.baseDakshana || 2100;
    const samagriCost = samagriOption === 'by_pandit' ? 1100 : 0;
    const totalAmount = dakshanaAmount + samagriCost;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `PANDIT-${new Date().getFullYear()}-${randomSuffix}`;

    const booking = await Booking.create({
      bookingNumber,
      user: req.user.id,
      priest: priestId,
      ritual: ritualId,
      ritualName: ritual.name,
      bookingDate: new Date(bookingDate),
      timeSlot,
      devoteeName: devoteeName || req.user.name,
      devoteePhone: devoteePhone || req.user.phone,
      gotra: gotra || req.user.gotra || 'Kashyap',
      familyMembers: familyMembers || '',
      address: {
        fullAddress,
        city: city || 'Delhi NCR',
        landmark: landmark || '',
        pinCode: pinCode || '',
      },
      samagriOption: samagriOption || 'by_pandit',
      dakshanaAmount,
      samagriCost,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'dakshana_on_ritual',
      specialInstructions: specialInstructions || '',
    });

    res.status(201).json({
      success: true,
      message: 'Auspicious Puja booked successfully! Pandit Ji has been notified.',
      data: booking,
    });
  } catch (error) {
    console.error('Booking Creation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking',
    });
  }
};

/**
 * @desc    Get all bookings for logged-in devotee
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'priest',
        populate: { path: 'user', select: 'name phone avatar' },
      })
      .populate('ritual')
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your bookings',
    });
  }
};

/**
 * @desc    Get all bookings for logged-in Priest
 * @route   GET /api/bookings/priest-bookings
 * @access  Private (Priest)
 */
exports.getPriestBookings = async (req, res) => {
  try {
    const priestProfile = await PriestProfile.findOne({ user: req.user.id });

    if (!priestProfile) {
      return res.status(404).json({
        success: false,
        message: 'No priest profile associated with this account',
      });
    }

    const bookings = await Booking.find({ priest: priestProfile._id })
      .populate('user', 'name phone email')
      .populate('ritual')
      .sort({ bookingDate: 1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching priest bookings',
    });
  }
};

/**
 * @desc    Update booking status (Confirm / Cancel / Complete)
 * @route   PUT /api/bookings/:id/status
 * @access  Private
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating booking status',
    });
  }
};
