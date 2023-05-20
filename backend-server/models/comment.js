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
  },
  rating: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'Comments' });

const Comment = mongoose.model('Comments', commentSchema);

module.exports = Comment;