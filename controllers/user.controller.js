const { Model } = require('mongoose');
const User = require('../models/User');


async function getUserProfile(req, res) {
    try {
        // req.user.id comes from middleware
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
}

async function updateUserProfile(req, res) {
    const user = await User.findByIdAndUpdate(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

module.exports = { getUserProfile, updateUserProfile };