const validator = require('../helpers/validate');

const saveProduct = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    description: 'required|string',
    price: 'required|numeric',
    category: 'required|string',
    inStock: 'required|boolean',
    quantity: 'required|numeric|min:0',     // NEW FIELD
    brand: 'required|string|min:2'          // NEW FIELD
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveCategory = (req, res, next) => {
  const validationRule = {
    name: 'required|string|min:2',
    description: 'required|string|min:10',
    isActive: 'required|boolean'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveProduct,
  saveCategory
};