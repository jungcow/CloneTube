import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  like: {
    type: Number,
    default: 0,
  },
  hate: {
    type: Number,
    default: 0,
  },
})

const model = mongoose.model('Comment', CommentSchema);

export default model;