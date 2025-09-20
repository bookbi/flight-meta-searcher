const flightDateService = require("../services/flightDateService");

exports.getAll = async (req, res) => {
  try {
    const results = await flightDateService.findAllWithAirport();
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
    const flightDate = await flightDateService.findByIdWithAirport(req.params.id);
    if (!flightDate) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }
    res.json(flightDate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const flight = await flightDateService.createWithAirportCheck(req.body);
    res.status(201).json({ message: "Flight created successfully", data: flight });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const flight = await flightDateService.updateWithAirportCheck(req.params.id, req.body);
    res.json({ message: "Flight updated successfully", data: flight });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await flightDateService.deleteWithAirportCheck(req.params.id);
    res.json({ message: "Flight deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};