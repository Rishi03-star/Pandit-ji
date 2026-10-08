const express = require('express');
const router = express.Router();
const {
  getPriests,
  getPriestById,
  updatePriestProfile,
  getFeaturedPriests,
} = require('../controllers/priestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPriests);
router.get('/featured', getFeaturedPriests);
router.get('/:id', getPriestById);
router.put('/:id', protect, updatePriestProfile);

module.exports = router;
