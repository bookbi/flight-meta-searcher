const express = require("express");
const router = express.Router();
const FlightDate = require("../models/flightDate");

// GET ทั้งหมด
router.get("/", async (req, res) => {
  const flights = await FlightDate.findAll();
  res.json(flights);
});

// GET ตาม ID
router.get("/:id", async (req, res) => {
  const flight = await FlightDate.findByPk(req.params.id);
  if (!flight) return res.status(404).json({ message: "Flight not found" });
  res.json(flight);
});

// POST เพิ่มใหม่
router.post("/", async (req, res) => {
  try {
    const flight = await FlightDate.create(req.body);
    res.status(201).json(flight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT อัปเดตตาม ID
router.put("/:id", async (req, res) => {
  try {
    const flight = await FlightDate.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    await flight.update(req.body);
    res.json(flight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ตาม ID
router.delete("/:id", async (req, res) => {
  const deleted = await FlightDate.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: "Flight not found" });
  res.sendStatus(204);
});

module.exports = router;
