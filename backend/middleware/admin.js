/**
 * Middleware: Admin — restricts access to admin-only routes
 * Must be used AFTER the protect middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Admin privileges required',
  });
};

module.exports = { adminOnly };
