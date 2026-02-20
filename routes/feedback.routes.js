const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedback, upvoteFeedback, deleteFeedback, updateStatus } = require('../controllers/feedback.controller');
const { protect } = require('../middlewares/auth.middleware');

// all routes below this require a valid JWT
router.use(protect);

router.route('/')
    .post(createFeedback)
    .get(getAllFeedback);

router.route('/:id/upvote')
    .put(upvoteFeedback);

router.route('/:id')
    .delete(deleteFeedback)
    .put(updateStatus);

module.exports = router;