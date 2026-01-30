const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { reviewValidation, validate } = require('../middleware/validator');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
