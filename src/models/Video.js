import mongoose, { Schema, SchemaType, SchemaTypes } from 'mongoose';

const VideoSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  views: {
    type: Number,
    default: 0
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  pastDate: String,
  random: Number,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const model = mongoose.model('Video', VideoSchema);

export default model;