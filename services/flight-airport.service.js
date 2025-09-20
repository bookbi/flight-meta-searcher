const FlightAirport = require('../models/FlightAirport');

async function list() {
  return FlightAirport.findAll();
}

async function getById(id) {
  return FlightAirport.findOne({ where: { id } });
}

async function create(payload) {
  const { flightno, departure, arrival, aircraft } = payload || {};
  if (!flightno || !departure || !arrival || !aircraft) {
    const err = new Error('All fields are required');
    err.status = 400;
    throw err;
  }
  return FlightAirport.create(payload);
}

async function update(id, payload) {
  const [updated] = await FlightAirport.update(payload, { where: { id } });
  if (!updated) return null;
  return FlightAirport.findOne({ where: { id } });
}

async function remove(id) {
  return FlightAirport.destroy({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
