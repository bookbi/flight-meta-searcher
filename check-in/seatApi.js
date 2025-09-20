const express = require("express");
const router = express.Router();

// import Sequelize model
const Seat = require("../models/seatApi");

// ฟังก์ชัน generate seats เช่น A1 B1 ... F30
function generateSeats(totalSeats, planeId) {
  const seats = [];
  const seatLetters = ["A", "B", "C", "D", "E", "F"];
  const rows = Math.ceil(totalSeats / seatLetters.length);

  for (let row = 1; row <= rows; row++) {
    for (let letter of seatLetters) {
      seats.push({ seatNumber: `${letter}${row}`, airplaneId: planeId });
      if (seats.length >= totalSeats) break;
    }
    if (seats.length >= totalSeats) break;
  }
  return seats;
}

// ดูที่นั่งทั้งหมดของเครื่องบิน
router.get("/planes/:planeId/seats", async (req, res) => {
  const planeId = req.params.planeId;
  try {
    const seats = await Seat.findAll({ where: { airplaneId: planeId } });
    res.json(seats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

// จองที่นั่ง
router.post("/planes/:planeId/seats/reserve", async (req, res) => {
  const { seatNumber, bookingId } = req.body;
  const planeId = req.params.planeId;

  try {
    const seat = await Seat.findOne({ where: { seatNumber, airplaneId: planeId } });
    if (!seat) return res.status(400).json({ error: "ไม่มีที่นั่งนี้" });
    if (seat.isBooked) return res.status(400).json({ error: "ที่นั่งนี้ถูกจองแล้ว" });

    seat.isBooked = true;
    seat.bookingId = bookingId;
    await seat.save();

    res.json({ message: `จองที่นั่ง ${seatNumber} สำเร็จ`, seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

// ยกเลิกการจอง
router.post("/planes/:planeId/seats/cancel", async (req, res) => {
  const { seatNumber } = req.body;
  const planeId = req.params.planeId;

  try {
    const seat = await Seat.findOne({ where: { seatNumber, airplaneId: planeId } });
    if (!seat) return res.status(400).json({ error: "ไม่มีที่นั่งนี้" });
    if (!seat.isBooked) return res.status(400).json({ error: "ที่นั่งยังไม่ได้ถูกจอง" });

    seat.isBooked = false;
    seat.bookingId = null;
    await seat.save();

    res.json({ message: `ยกเลิกการจองที่นั่ง ${seatNumber} สำเร็จ`, seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

// สร้างที่นั่งใหม่ (init) ส่ง totalSeats ผ่าน body
router.post("/planes/:planeId/seats/init", async (req, res) => {
  const planeId = req.params.planeId;
  const { totalSeats } = req.body;

  if (!totalSeats || totalSeats <= 0) {
    return res.status(400).json({ error: "กรุณากรอก totalSeats ให้ถูกต้อง" });
  }

  try {
    // ลบที่นั่งเก่า
    await Seat.destroy({ where: { airplaneId: planeId } });

    // สร้างที่นั่งใหม่
    const seatsData = generateSeats(totalSeats, planeId);
    const seats = await Seat.bulkCreate(seatsData);

    res.json({ message: `สร้างที่นั่งสำเร็จ`, seats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

module.exports = router;
