const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');
const { categoryValidation, validate } = require('../middleware/validator');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, admin, categoryValidation, validate, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
