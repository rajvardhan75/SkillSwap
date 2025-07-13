const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET /api/users/search?skill=Photoshop
router.get('/search', async (req, res) => {
  const skill = req.query.skill;

  if (!skill) {
    return res.status(400).json({ error: 'Skill query is required' });
  }

  try {
    const users = await User.find({
      isPublic: true,
      skillsOffered: { $regex: new RegExp(skill, 'i') } // case-insensitive
    }).select('-password');

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ✅ GET /api/users/:id – with average rating
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    const ratings = user.ratings || [];
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

    res.json({
      name: user.name,
      email: user.email,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      availability: user.availability,
      isPublic: user.isPublic,
      averageRating
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ PUT /api/users/:id – Update profile
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, skillsOffered, skillsWanted, availability, isPublic },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
