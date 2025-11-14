const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');
const validation = require('../middleware/validate');

router.get('/', productsController.getAll);

router.get('/:id', productsController.getSingle);

router.post('/', validation.saveProduct, productsController.createProduct);

router.put('/:id', validation.saveProduct, productsController.updateProduct);

router.delete('/:id', productsController.deleteProduct);

module.exports = router;