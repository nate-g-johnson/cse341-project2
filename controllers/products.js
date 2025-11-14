const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res) => {
  mongodb
    .getDatabase()
    .db()
    .collection('products')
    .find()
    .toArray((err, lists) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};

const getSingle = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid product id to find a product.');
  }
  const productId = new ObjectId(req.params.id);
  mongodb
    .getDatabase()
    .db()
    .collection('products')
    .find({ _id: productId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const createProduct = async (req, res) => {
    // #swagger.tags = ['Products']
    const product = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        inStock: req.body.inStock,
        quantity: req.body.quantity,      // NEW FIELD
        brand: req.body.brand              // NEW FIELD
    };
    const response = await mongodb.getDatabase().db().collection('products').insertOne(product);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the product.');
    }
};

const updateProduct = async (req, res) => {
    // #swagger.tags = ['Products']
    const productId = new ObjectId(req.params.id);
    const product = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        inStock: req.body.inStock,
        quantity: req.body.quantity,      // NEW FIELD
        brand: req.body.brand              // NEW FIELD
    };
    const response = await mongodb.getDatabase().db().collection('products').replaceOne({ _id: productId }, product);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the product.');
    }
};

const deleteProduct = async (req, res) => {
    // #swagger.tags = ['Products']
    const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('products').deleteOne({ _id: productId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the product.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createProduct,
    updateProduct,
    deleteProduct
};