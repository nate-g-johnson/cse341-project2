const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res) => {
  mongodb
    .getDatabase()
    .db()
    .collection('categories')
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
    res.status(400).json('Must use a valid category id to find a category.');
  }
  const categoryId = new ObjectId(req.params.id);
  mongodb
    .getDatabase()
    .db()
    .collection('categories')
    .find({ _id: categoryId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const createCategory = async (req, res) => {
    // #swagger.tags = ['Categories']
    const category = {
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive
    };
    const response = await mongodb.getDatabase().db().collection('categories').insertOne(category);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the category.');
    }
};

const updateCategory = async (req, res) => {
    // #swagger.tags = ['Categories']
    const categoryId = new ObjectId(req.params.id);
    const category = {
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive
    };
    const response = await mongodb.getDatabase().db().collection('categories').replaceOne({ _id: categoryId }, category);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the category.');
    }
};

const deleteCategory = async (req, res) => {
    // #swagger.tags = ['Categories']
    const categoryId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('categories').deleteOne({ _id: categoryId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the category.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createCategory,
    updateCategory,
    deleteCategory
};