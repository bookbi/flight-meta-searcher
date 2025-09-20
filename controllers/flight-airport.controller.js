const service = require('../services/flight-airport.service');

// GET all
exports.list = async (req, res) => {
  try {
    const flights = await service.list();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// GET by ID
exports.get = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const flight = await service.getById(id);
    if (!flight) return res.status(404).json({ error: 'FlightAirport not found' });

    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// POST
exports.create = async (req, res) => {
  try {
    const { flightno, departure, arrival, aircraft } = req.body;
    if (!flightno || !departure || !arrival || !aircraft) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (departure.toUpperCase() === arrival.toUpperCase()) {
      return res.status(400).json({ error: 'Departure and arrival cannot be the same' });
    }

    const flight = await service.create({
      flightno,
      departure: departure.toUpperCase(),
      arrival: arrival.toUpperCase(),
      aircraft
    });

    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flightAirport' });
  }
};

// PUT
exports.update = async (req, res) => {
  try {
    const { departure, arrival } = req.body;
    if (departure && arrival && departure.toUpperCase() === arrival.toUpperCase()) {
      return res.status(400).json({ error: 'Departure and arrival cannot be the same' });
    }

    const flight = await service.update(req.params.id, req.body);
    if (!flight) return res.status(404).json({ error: 'FlightAirport not found' });

    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data' });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await service.remove(id);
    if (!deleted) return res.status(404).json({ error: 'FlightAirport not found' });

    res.json({ message: `ลบ เที่ยวบิน ${req.params.id} สำเร็จ` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
};
