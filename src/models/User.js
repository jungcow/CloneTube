import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  snsId: {
    githubId: {
      type: Number,
    },
    kakaoId: {
      type: Number,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });


const model = mongoose.model('User', UserSchema);

export default model;