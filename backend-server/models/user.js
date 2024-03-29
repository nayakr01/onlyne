const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String
  },
  lists_created: [{
    type: String,
    ref: 'list',
  }],
  lists_favourite: [{
    type: String,
    ref: 'list',
  }],
  ratings: [{
    type: Array
  }],
  comments: [{
    type: Array
  }]
}, {collection: 'Users'});

userSchema.plugin(uniqueValidator, { 
  message: 'Error: {PATH} ya está en uso.',
  type: 'mongoose-unique-validator', 
});
module.exports = mongoose.model('user', userSchema);