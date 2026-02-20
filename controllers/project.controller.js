const Project = require('../models/Project');
const User = require('../models/User');

async function createProject(req, res) {
  const project = await Project.create(req.body);
  res.status(201).json(project);
};

async function assignUserToProject(req, res) {
  const { userId, projectId } = req.body;
  const user = await User.findByIdAndUpdate(
    userId, 
    { project: projectId }, 
    { new: true }
  );
  res.json({ message: `User ${user.name} assigned to project.` });
};

module.exports = { createProject, assignUserToProject };