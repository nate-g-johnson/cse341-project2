const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categories');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', categoriesController.getAll);

router.get('/:id', categoriesController.getSingle);

router.post('/', isAuthenticated, validation.saveCategory, categoriesController.createCategory);

router.put('/:id', isAuthenticated, validation.saveCategory, categoriesController.updateCategory);

router.delete('/:id', isAuthenticated, categoriesController.deleteCategory);

module.exports = router;