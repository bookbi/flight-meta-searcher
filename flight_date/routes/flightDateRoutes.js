const express = require("express");
const router = express.Router();
const FlightDate = require("../models/flightDate");
const FlightAirport = require("../../flight/models/FlightAirport");

// GET ทั้งหมด
router.get("/", async (req, res) => {
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
});

// GET ตาม ID
router.get('/:id', async (req, res) => {
  try {
    // หา FlightDate ตาม id ก่อน
    const flightDate = await FlightDate.findByPk(req.params.id);
    if (!flightDate) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    // หา FlightAirport ที่ departure และ arrival ตรงกัน
    const flightAirport = await FlightAirport.findOne({
      where: {
        departure: flightDate.departure,
        arrival: flightDate.arrival
      }
    });

    if (!flightAirport) {
      return res.status(404).json({ message: "ไม่มีไฟล์ทบินนั้น" });
    }

    // ถ้าตรงกัน แสดงข้อมูลทั้งหมดของ FlightDate
    res.json(flightDate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST เพิ่มใหม่
router.post("/", async (req, res) => {
  try {

  const { departure, arrival, date, departureTime, arrivalTime } = req.body;
  if (!departure || !arrival || !date || !departureTime || !arrivalTime ) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
  }
  try {
    const flight = await FlightDate.create(req.body);
    res.status(201).json({ message: "Flight created successfully", data: flight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT อัปเดตตาม ID
router.put("/:id", async (req, res) => {
  try {
    const { departure, arrival, date, departureTime, arrivalTime } = req.body;
    if (!departure || !arrival || !date || !departureTime || !arrivalTime) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
    }
    const flight = await FlightDate.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    await flight.update(req.body);
    res.json({ message: "Flight updated successfully", data: flight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ตาม ID
router.delete("/:id", async (req, res) => {
  const deleted = await FlightDate.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: "Flight not found" });
  res.json({ message: "Flight deleted successfully" });
});

module.exports = router;
