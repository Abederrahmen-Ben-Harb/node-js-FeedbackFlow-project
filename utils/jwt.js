const jwt = require('jsonwebtoken');

function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

module.exports = { signToken, verifyToken, generateToken };