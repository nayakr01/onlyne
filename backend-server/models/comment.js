const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  id: {
    type: String,
  },
  movieSerieId: {
    type: Array,
    required: true
  },
  userId: {
    type: String,
    ref: 'user',
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, { collection: 'Comments' });

const Comment = mongoose.model('Comments', commentSchema);

module.exports = Comment;