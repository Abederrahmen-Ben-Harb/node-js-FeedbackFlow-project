const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

// all routes below this require a valid JWT
router.use(protect);

router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile);

module.exports = router;