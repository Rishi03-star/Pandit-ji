const Review = require('../models/Review');
const PriestProfile = require('../models/PriestProfile');

/**
 * @desc    Submit a review for a priest
 * @route   POST /api/reviews
 * @access  Private
 */
exports.createReview = async (req, res) => {
  try {
    const { priestId, rating, comment, ritualName, bookingId } = req.body;

    const review = await Review.create({
      priest: priestId,
      user: req.user.id,
      booking: bookingId,
      devoteeName: req.user.name,
      ritualName: ritualName || 'Vedic Puja',
      rating: Number(rating),
      comment,
      isVerified: true,
    });

    // Recalculate Priest's average rating
    const reviews = await Review.find({ priest: priestId });
    const avgRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await PriestProfile.findByIdAndUpdate(priestId, {
      rating: Number(avgRating.toFixed(1)),
      reviewCount: reviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Review and blessings submitted successfully!',
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting review',
    });
  }
};

/**
 * @desc    Get reviews for a priest
 * @route   GET /api/reviews/priest/:priestId
 * @access  Public
 */
exports.getPriestReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ priest: req.params.priestId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews',
    });
  }
};
