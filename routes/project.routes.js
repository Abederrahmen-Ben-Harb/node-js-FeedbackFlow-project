const express = require('express');
const router = express.Router();
const { createProject, assignUserToProject } = require('../controllers/project.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Strict Admin Only Routes
router.use(protect, authorize('admin'));

router.post('/', createProject);
router.put('/assign', assignUserToProject);

module.exports = router;