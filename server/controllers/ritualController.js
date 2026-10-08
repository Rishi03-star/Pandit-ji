const Ritual = require('../models/Ritual');
const PriestProfile = require('../models/PriestProfile');

/**
 * @desc    Get all rituals with category & search filter
 * @route   GET /api/rituals
 * @access  Public
 */
exports.getRituals = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { detailedSignificance: { $regex: search, $options: 'i' } },
      ];
    }

    const rituals = await Ritual.find(query).sort({ isPopular: -1, name: 1 });

    res.json({
      success: true,
      count: rituals.length,
      data: rituals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching rituals',
    });
  }
};

/**
 * @desc    Get single ritual by slug or ID
 * @route   GET /api/rituals/:identifier
 * @access  Public
 */
exports.getRitualById = async (req, res) => {
  try {
    const { identifier } = req.params;
    let ritual;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      ritual = await Ritual.findById(identifier);
    } else {
      ritual = await Ritual.findOne({ slug: identifier });
    }

    if (!ritual) {
      return res.status(404).json({
        success: false,
        message: 'Ritual not found',
      });
    }

    // Find available pandits who perform this ritual
    const priests = await PriestProfile.find({
      $or: [
        { specializations: { $regex: new RegExp(ritual.name, 'i') } },
        { 'ritualsOffered.ritualName': { $regex: new RegExp(ritual.name, 'i') } },
      ],
    }).populate('user', 'name avatar');

    res.json({
      success: true,
      data: {
        ritual,
        availablePriests: priests,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching ritual details',
    });
  }
};
