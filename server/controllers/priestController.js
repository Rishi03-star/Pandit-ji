const PriestProfile = require('../models/PriestProfile');
const User = require('../models/User');

/**
 * @desc    Get all priests with search & filters (city, ritual, language, experience)
 * @route   GET /api/priests
 * @access  Public
 */
exports.getPriests = async (req, res) => {
  try {
    const { city, ritual, language, minRating, sort, search } = req.query;

    let query = {};

    if (city && city !== 'All Cities') {
      query.city = { $regex: new RegExp(city, 'i') };
    }

    if (ritual && ritual !== 'All Rituals') {
      query.$or = [
        { specializations: { $regex: new RegExp(ritual, 'i') } },
        { 'ritualsOffered.ritualName': { $regex: new RegExp(ritual, 'i') } },
      ];
    }

    if (language && language !== 'All Languages') {
      query.languages = { $regex: new RegExp(language, 'i') };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (search) {
      query.$or = [
        { bio: { $regex: search, $options: 'i' } },
        { vedicLineage: { $regex: search, $options: 'i' } },
        { specializations: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    let queryBuilder = PriestProfile.find(query).populate('user', 'name email phone avatar');

    // Sorting options
    if (sort === 'rating') {
      queryBuilder = queryBuilder.sort({ rating: -1, reviewCount: -1 });
    } else if (sort === 'experience') {
      queryBuilder = queryBuilder.sort({ experienceYears: -1 });
    } else if (sort === 'dakshana_asc') {
      queryBuilder = queryBuilder.sort({ baseDakshana: 1 });
    } else if (sort === 'dakshana_desc') {
      queryBuilder = queryBuilder.sort({ baseDakshana: -1 });
    } else {
      queryBuilder = queryBuilder.sort({ rating: -1 });
    }

    const priests = await queryBuilder;

    res.json({
      success: true,
      count: priests.length,
      data: priests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching priests',
    });
  }
};

/**
 * @desc    Get single priest by ID
 * @route   GET /api/priests/:id
 * @access  Public
 */
exports.getPriestById = async (req, res) => {
  try {
    const priest = await PriestProfile.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('ritualsOffered.ritualId');

    if (!priest) {
      return res.status(404).json({
        success: false,
        message: 'Priest profile not found',
      });
    }

    res.json({
      success: true,
      data: priest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching priest details',
    });
  }
};

/**
 * @desc    Update priest profile (for priest user)
 * @route   PUT /api/priests/:id
 * @access  Private (Priest/Admin)
 */
exports.updatePriestProfile = async (req, res) => {
  try {
    let priest = await PriestProfile.findById(req.params.id);

    if (!priest) {
      return res.status(404).json({
        success: false,
        message: 'Priest profile not found',
      });
    }

    // Verify ownership
    if (priest.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
    }

    const updated = await PriestProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email phone');

    res.json({
      success: true,
      message: 'Priest profile updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating priest profile',
    });
  }
};

/**
 * @desc    Get featured top-rated priests
 * @route   GET /api/priests/featured
 * @access  Public
 */
exports.getFeaturedPriests = async (req, res) => {
  try {
    const featured = await PriestProfile.find({ isVerified: true })
      .sort({ rating: -1, experienceYears: -1 })
      .limit(6)
      .populate('user', 'name avatar');

    res.json({
      success: true,
      data: featured,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching featured priests',
    });
  }
};
