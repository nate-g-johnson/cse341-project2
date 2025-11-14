const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categories');
const validation = require('../middleware/validate');

router.get('/', categoriesController.getAll);

router.get('/:id', categoriesController.getSingle);

router.post('/', validation.saveCategory, categoriesController.createCategory);

router.put('/:id', validation.saveCategory, categoriesController.updateCategory);

router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;