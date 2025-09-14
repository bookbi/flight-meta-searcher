const svc = require('./auth.service');

exports.register = async (req, res, next) => {
  try {
    const user = await svc.register(req.body);
    // ไม่คืน passwordHash
    res.status(201).json({ id: user.id, email: user.email, fullName: user.fullName });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const token = await svc.login(req.body);
    res.json({ token });
  } catch (e) { next(e); }
};

exports.me = async (req, res, next) => {
  try {
    // req.user ถูกเติมโดย requireAuth
    const me = await svc.getMe(req.user.sub);
    res.json(me);
  } catch (e) { next(e); }
};
