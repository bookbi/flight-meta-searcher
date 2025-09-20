const FlightDate = require("../models/flightDate");
const FlightAirport = require("../models/FlightAirport");

exports.findAllWithAirport = async () => {
  const flights = await FlightDate.findAll();
  const results = [];

  for (const flightDate of flights) {
    const flightAirport = await FlightAirport.findOne({
      where: {
        departure: flightDate.departure.toUpperCase(),
        arrival: flightDate.arrival.toUpperCase()
      }
    });
    if (flightAirport) {
      results.push(flightDate);
    }
  }
  return results;
};

exports.findByIdWithAirport = async (id) => {
  const flightDate = await FlightDate.findByPk(id);
  if (!flightDate) return null;

  const flightAirport = await FlightAirport.findOne({
    where: {
      departure: flightDate.departure.toUpperCase(),
      arrival: flightDate.arrival.toUpperCase()
    }
  });
  if (!flightAirport) return null;

  return flightDate;
};

exports.createWithAirportCheck = async (data) => {
  const { departure, arrival, date, departureTime, arrivalTime } = data;
  if (!departure || !arrival || !date || !departureTime || !arrivalTime) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ");
  }

    departure = departure.toUpperCase();
    arrival = arrival.toUpperCase();

  const flightAirport = await FlightAirport.findOne({
    where: { departure, arrival }
  });
  if (!flightAirport) {
    throw new Error("ไม่มีไฟล์ทบินนั้น");
  }

  return await FlightDate.create(data);
};

exports.updateWithAirportCheck = async (id, data) => {
  const { departure, arrival, date, departureTime, arrivalTime } = data;
  if (!departure || !arrival || !date || !departureTime || !arrivalTime) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ");
  }

    departure = departure.toUpperCase();
    arrival = arrival.toUpperCase();

  const flightAirport = await FlightAirport.findOne({
    where: { departure, arrival }
  });
  if (!flightAirport) {
    throw new Error("ไม่มีไฟล์ทบินนั้น");
  }

  const flight = await FlightDate.findByPk(id);
  if (!flight) throw new Error("Flight not found");

  await flight.update(data);
  return flight;
};

exports.deleteWithAirportCheck = async (id) => {
  const flightDate = await FlightDate.findByPk(id);
  if (!flightDate) throw new Error("ไม่มีไฟล์ทบินนั้น");

  const flightAirport = await FlightAirport.findOne({
    where: {
      departure: flightDate.departure.toUpperCase(),
      arrival: flightDate.arrival.toUpperCase()
    }
  });
  if (!flightAirport) throw new Error("ไม่มีไฟล์ทบินนั้น");

  await flightDate.destroy();
  return true;
};