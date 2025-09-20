const FlightDate = require("../models/flightDate");
const FlightAirport = require("../models/FlightAirport");

exports.getAll = async (req, res) => {
  try {
    const flights = await FlightDate.findAll();
    const results = [];

    for (const flightDate of flights) {
      const flightAirport = await FlightAirport.findOne({
        where: {
          departure: flightDate.departure,
          arrival: flightDate.arrival
        }
      });

      if (flightAirport) {
        results.push(flightDate);
      }
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const flightDate = await FlightDate.findByPk(req.params.id);
    if (!flightDate) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    const flightAirport = await FlightAirport.findOne({
      where: {
        departure: flightDate.departure,
        arrival: flightDate.arrival
      }
    });

    if (!flightAirport) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    res.json(flightDate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { departure, arrival, date, departureTime, arrivalTime } = req.body;
    if (!departure || !arrival || !date || !departureTime || !arrivalTime) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const flightAirport = await FlightAirport.findOne({
      where: { departure, arrival }
    });
    if (!flightAirport) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    const flight = await FlightDate.create(req.body);
    res.status(201).json({ message: "Flight created successfully", data: flight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { departure, arrival, date, departureTime, arrivalTime } = req.body;
    if (!departure || !arrival || !date || !departureTime || !arrivalTime) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const flightAirport = await FlightAirport.findOne({
      where: { departure, arrival }
    });
    if (!flightAirport) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    const flight = await FlightDate.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    await flight.update(req.body);
    res.json({ message: "Flight updated successfully", data: flight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const flightDate = await FlightDate.findByPk(req.params.id);
    if (!flightDate) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    const flightAirport = await FlightAirport.findOne({
      where: {
        departure: flightDate.departure,
        arrival: flightDate.arrival
      }
    });

    if (!flightAirport) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    await flightDate.destroy();
    res.json({ message: "Flight deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};