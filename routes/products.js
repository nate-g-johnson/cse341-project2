const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', productsController.getAll);

router.get('/:id', productsController.getSingle);

router.post('/', isAuthenticated, validation.saveProduct, productsController.createProduct);

router.put('/:id', isAuthenticated, validation.saveProduct, productsController.updateProduct);

router.delete('/:id', isAuthenticated, productsController.deleteProduct);

module.exports = router;