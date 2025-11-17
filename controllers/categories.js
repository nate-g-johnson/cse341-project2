const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const lists = await mongodb
      .getDatabase()
      .db()
      .collection('categories')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error occurred while retrieving categories.' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid category id to find a category.' });
    }
    const categoryId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('categories')
      .findOne({ _id: categoryId });
    
    if (!result) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error occurred while retrieving category.' });
  }
};

const createCategory = async (req, res) => {
  // #swagger.tags = ['Categories']
  try {
    const category = {
      name: req.body.name,
      description: req.body.description,
      isActive: req.body.isActive
    };
    const response = await mongodb.getDatabase().db().collection('categories').insertOne(category);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the category.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while creating the category.' });
  }
};

const updateCategory = async (req, res) => {
  // #swagger.tags = ['Categories']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid category id to update a category.' });
    }
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
      res.status(500).json({ message: 'Some error occurred while updating the category.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while updating the category.' });
  }
};

const deleteCategory = async (req, res) => {
  // #swagger.tags = ['Categories']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid category id to delete a category.' });
    }
    const categoryId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('categories').deleteOne({ _id: categoryId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while deleting the category.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the category.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createCategory,
  updateCategory,
  deleteCategory
};