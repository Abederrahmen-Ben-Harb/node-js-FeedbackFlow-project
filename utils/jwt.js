const jwt = require('jsonwebtoken');

// function signToken(payload) {
//     return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
// }

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

function generateToken(user) {
  return jwt.sign(
    { 
        id: user._id,
        role: user.role,
        project: user.project
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = { verifyToken, generateToken };