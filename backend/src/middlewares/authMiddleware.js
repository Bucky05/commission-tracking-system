const {verify} = require('../services/jwtService')
module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};