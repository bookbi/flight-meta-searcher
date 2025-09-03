const rateLimit = require('express-rate-limit');

exports.searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many requests, please try again later.',
});