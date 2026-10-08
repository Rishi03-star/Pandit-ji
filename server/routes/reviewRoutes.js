const express = require('express');
const router = express.Router();
const { createReview, getPriestReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/priest/:priestId', getPriestReviews);

module.exports = router;
