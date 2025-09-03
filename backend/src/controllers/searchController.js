const { Search, AggregatedResult } = require('../models');
const { aggregateFlights } = require('../services/aggregationService');

exports.createSearch = async (req, res, next) => {
  try {
    const { origin, destination, departDate, returnDate, passengers } = req.body;
    const search = await Search.create({ origin, destination, departDate, returnDate, passengers });

    const bestByProvider = await aggregateFlights({ origin, destination, departDate, returnDate, passengers });
    const aggResult = await AggregatedResult.create({ searchId: search.id, bestByProvider });

    res.status(201).json({ search, result: aggResult });
  } catch (err) {
    next(err);
  }
};

exports.getSearchById = async (req, res, next) => {
  try {
    const search = await Search.findByPk(req.params.id, { include: AggregatedResult });
    if (!search) return res.status(404).json({ error: 'Search not found' });
    res.json(search);
  } catch (err) {
    next(err);
  }
};