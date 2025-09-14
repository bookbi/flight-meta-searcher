exports.create = (req, res, next) => {
  const { userId, flightDateId, passengers } = req.body;
  if (!userId || !flightDateId) return res.status(400).json({ error: 'userId & flightDateId required' });
  if (passengers !== undefined && Number(passengers) < 1) return res.status(400).json({ error: 'passengers must be >= 1' });
  next();
};

exports.update = (req, res, next) => {
  const { passengers } = req.body;
  if (!passengers || Number(passengers) < 1) return res.status(400).json({ error: 'passengers must be >= 1' });
  next();
};
