// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillsOffered: [String],
  skillsWanted: [String],
  availability: String,
  isPublic: { type: Boolean, default: true },
  profileImage: { type: String, default: '' },
  averageRating: {
  type: Number,
  default: 0
},
totalRatings: {
  type: Number,
  default: 0
},
feedback: {
  fromSender: {
    rating: Number,
    comment: String,
  },
  fromReceiver: {
    rating: Number,
    comment: String,
  }
}





}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
