exports.register = (req, res, next) => {
  const { email, password, fullName } = req.body || {};
  if (!email || !password || !fullName)
    return res.status(400).json({ error: 'email, password, fullName are required' });
  next();
};

exports.login = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });
  next();
};
