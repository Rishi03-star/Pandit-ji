const User = require('../models/User');
const PriestProfile = require('../models/PriestProfile');
const { generateToken } = require('../middleware/authMiddleware');

/**
 * @desc    Register a new user (Devotee or Priest)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, city, gotra, experienceYears, languages, specializations, vedicLineage, bio, baseDakshana } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'devotee',
      address: {
        city: city || 'Delhi NCR',
      },
      gotra: gotra || '',
    });

    let priestProfile = null;

    // If registered as Priest, create associated PriestProfile
    if (user.role === 'priest') {
      priestProfile = await PriestProfile.create({
        user: user._id,
        title: req.body.title || 'Acharya',
        vedicLineage: vedicLineage || 'Shukla Yajurveda Tradition',
        experienceYears: experienceYears || 5,
        languages: languages && languages.length > 0 ? languages : ['Sanskrit', 'Hindi'],
        specializations: specializations && specializations.length > 0 ? specializations : ['Satyanarayan Katha', 'Griha Pravesh', 'Rudrabhishek'],
        bio: bio || 'Vedic Pandit Ji available for auspicious rituals and home ceremonies.',
        city: city || 'Delhi NCR',
        baseDakshana: baseDakshana || 2100,
        isVerified: true,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gotra: user.gotra,
        city: user.address?.city,
      },
      priestProfile,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating user account',
    });
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user (include password for verification)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    let priestProfile = null;
    if (user.role === 'priest') {
      priestProfile = await PriestProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gotra: user.gotra,
        city: user.address?.city,
        avatar: user.avatar,
      },
      priestProfile,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error during login',
    });
  }
};

/**
 * @desc    Get current logged in user & priest info
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let priestProfile = null;

    if (user.role === 'priest') {
      priestProfile = await PriestProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gotra: user.gotra,
        address: user.address,
        avatar: user.avatar,
      },
      priestProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gotra, city, fullAddress } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gotra !== undefined) user.gotra = gotra;
    if (city) user.address.city = city;
    if (fullAddress) user.address.fullAddress = fullAddress;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        gotra: updatedUser.gotra,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
};
