const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const listSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  listPhoto: {
    type: String
  },
  author: {
    type: String,
    ref: 'user',
    required: true
  }
}, {collection: 'Lists'});

listSchema.plugin(uniqueValidator, { 
  message: 'Error: {PATH} ya está en uso.',
  type: 'mongoose-unique-validator', 
});
module.exports = mongoose.model('list', listSchema);