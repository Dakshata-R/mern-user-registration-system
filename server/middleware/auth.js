const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.header('x-auth-token') || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;