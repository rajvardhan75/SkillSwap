const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
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

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);
