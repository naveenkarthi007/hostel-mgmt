const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

const roleCheck = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
  }
  next();
};

const caretakerOrAdmin = (req, res, next) => {
  if (!['admin', 'caretaker'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Caretaker or Admin access required.' });
  }
  next();
};

const wardenOrAdmin = (req, res, next) => {
  if (!['admin', 'warden'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Warden or Admin access required.' });
  }
  next();
};

module.exports = { authenticate, adminOnly, roleCheck, caretakerOrAdmin, wardenOrAdmin };
