const Feedback = require('../models/Feedback');

async function createFeedback(req, res) {
  try {
    const { title, description } = req.body;
    
    const feedback = await Feedback.create({
      title,
      description,
      creator: req.user.id // Tied to the authenticated user
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: 'Invalid feedback data' });
  }
};

// @desc    Get all feedback (Authenticated users only)
// @route   GET /api/feedback
async function getAllFeedback(req, res) {
  const feedback = await Feedback.find({})
    .populate('creator', 'name email')
    .sort({ createdAt: -1 });
    
  res.json(feedback);
};

// @desc    Upvote a feedback
// @route   PUT /api/feedback/:id/upvote
async function upvoteFeedback(req, res) {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  // Check if user already upvoted
  const alreadyUpvoted = feedback.upvotes.includes(req.user.id);

  if (alreadyUpvoted) {
    // Remove upvote (Toggle behavior)
    feedback.upvotes = feedback.upvotes.filter(id => id.toString() !== req.user.id);
  } else {
    // Add upvote
    feedback.upvotes.push(req.user.id);
  }

  await feedback.save();
  res.json(feedback);
};

// @desc    Delete feedback (Only Creator or Admin)
// @route   DELETE /api/feedback/:id
async function deleteFeedback(req, res) {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  // Check ownership OR if user is admin
  if (feedback.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Not authorized to delete this' });
  }

  await feedback.deleteOne();
  res.json({ message: 'Feedback removed' });
};

async function updateStatus(req, res) {
  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(feedback);
};

module.exports = {
  createFeedback,
  getAllFeedback,
  upvoteFeedback,
  deleteFeedback,
  updateStatus
};