const Feedback = require('../models/Feedback');

async function createFeedback(req, res) {

  if (!req.user.project) {
    return res.status(403).json({ message: "You must be assigned to a project to post." });
  }
  try {
    const { title, description } = req.body;
    
    const feedback = await Feedback.create({
      title,
      description,
      creator: req.user.id, // Tied to the authenticated user
      project: req.user.project // Tied to the user's project
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: 'Invalid feedback data' });
  }
};

// Get all feedback (authenticated users only)
// GET: /api/feedback
async function getAllFeedback(req, res) {
  const feedback = await Feedback.find({project: req.user.project})
    .populate('creator', 'name')
    .sort({ createdAt: -1 });
    
  res.json(feedback);
};

// Upvote a feedback
// PUT: /api/feedback/:id/upvote
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

// Delete feedback (Only Creator or Admin)
// DELETE: /api/feedback/:id
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