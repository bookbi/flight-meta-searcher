const { Route } = require('../models');

exports.getAllRoutes = async (req, res, next) => {
  try {
    const routes = await Route.findAll();
    res.json(routes);
  } catch (err) {
    next(err);
  }
};

exports.createRoute = async (req, res, next) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    next(err);
  }
};

exports.updateRoute = async (req, res, next) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    await route.update(req.body);
    res.json(route);
  } catch (err) {
    next(err);
  }
};

exports.deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    await route.destroy();
    res.json({ message: 'Route deleted' });
  } catch (err) {
    next(err);
  }
};
