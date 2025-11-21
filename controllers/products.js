const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const lists = await mongodb
      .getDatabase()
      .db()
      .collection('products')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error occurred while retrieving products.' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid product id to find a product.' });
    }
    const productId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('products')
      .findOne({ _id: productId });
    
    if (!result) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error occurred while retrieving product.' });
  }
};

const createProduct = async (req, res) => {
    // #swagger.tags = ['Products']
    // #swagger.security = [{ "oauth2": [] }]
  try {
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock,
      quantity: req.body.quantity,
      brand: req.body.brand
    };
    const response = await mongodb.getDatabase().db().collection('products').insertOne(product);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the product.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while creating the product.' });
  }
};

const updateProduct = async (req, res) => {
    // #swagger.tags = ['Products']
    // #swagger.security = [{ "oauth2": [] }]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid product id to update a product.' });
    }
    const productId = new ObjectId(req.params.id);
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock,
      quantity: req.body.quantity,
      brand: req.body.brand
    };
    const response = await mongodb.getDatabase().db().collection('products').replaceOne({ _id: productId }, product);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while updating the product.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while updating the product.' });
  }
};

const deleteProduct = async (req, res) => {
    // #swagger.tags = ['Products']
    // #swagger.security = [{ "oauth2": [] }]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid product id to delete a product.' });
    }
    const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('products').deleteOne({ _id: productId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while deleting the product.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the product.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createProduct,
  updateProduct,
  deleteProduct
};