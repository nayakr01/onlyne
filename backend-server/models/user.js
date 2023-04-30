const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
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
  lists_created: [{
    type: Array
  }],
  lists_favourite: [{
    type: Array
  }],
  ratings: [{
    type: Array
  }]
}, {collection: 'Users'});

userSchema.plugin(uniqueValidator, { 
  message: 'Error, {PATH} already in use.',
  type: 'mongoose-unique-validator', 
});
module.exports = mongoose.model('user', userSchema);