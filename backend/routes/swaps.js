const express = require('express');
const router = express.Router();
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// 1. Send a new swap request
router.post('/send', async (req, res) => {
  const { fromUser, toUser, message } = req.body;
  try {
    const swap = await SwapRequest.create({ fromUser, toUser, message });
    res.json(swap);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to send swap request' });
  }
});

// 2. Get all swap requests related to a user (sent or received)
router.get('/all/:userId', async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [{ fromUser: req.params.userId }, { toUser: req.params.userId }]
    })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

// 3. Get only received swap requests
router.get('/received/:userId', async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ toUser: req.params.userId })
      .populate('fromUser', 'name email')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch received requests' });
  }
});

// 4. Get only sent swap requests
router.get('/sent/:userId', async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ fromUser: req.params.userId })
      .populate('toUser', 'name email')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sent requests' });
  }
});

// 5. Respond to a swap request (accept/reject)
router.put('/respond/:swapId', async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const updated = await SwapRequest.findByIdAndUpdate(
      req.params.swapId,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Swap not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// GET /api/swaps/inbox/:userId
router.get('/inbox/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const swaps = await SwapRequest.find({
      toUser: userId
    })
      .populate('fromUser', 'name email')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch inbox requests' });
  }
});

// POST /api/swaps/:id/feedback
router.post('/:id/feedback', async (req, res) => {
  const { userId, rating, comment } = req.body;

  try {
    const swap = await SwapRequest.findById(req.params.id).populate('fromUser toUser');
    if (!swap || swap.status !== 'accepted') {
      return res.status(400).json({ error: 'Invalid or unaccepted request' });
    }

    const isSender = swap.fromUser._id.toString() === userId;
    const feedbackKey = isSender ? 'fromSender' : 'fromReceiver';

    swap.feedback[feedbackKey] = { rating, comment };
    await swap.save();

    // Update the rated user
    const ratedUserId = isSender ? swap.toUser._id : swap.fromUser._id;
    const user = await User.findById(ratedUserId);
    const total = user.averageRating * user.totalRatings + rating;
    user.totalRatings += 1;
    user.averageRating = total / user.totalRatings;
    await user.save();

    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// GET /api/swaps/accepted/:userId
router.get('/accepted/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const swaps = await SwapRequest.find({
      status: 'accepted',
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ updatedAt: -1 });

    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch accepted swaps' });
  }
});

router.put('/feedback/:swapId', async (req, res) => {
  try {
    const updateFields = {};
    if (req.body.fromSender) updateFields['feedback.fromSender'] = req.body.fromSender;
    if (req.body.fromReceiver) updateFields['feedback.fromReceiver'] = req.body.fromReceiver;

    const updated = await SwapRequest.findByIdAndUpdate(
      req.params.swapId,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Swap not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});


// DELETE /api/swaps/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await SwapRequest.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
