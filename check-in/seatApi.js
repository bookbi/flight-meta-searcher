const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// ✅ config PostgreSQL
const pool = new Pool({
  user: "postgres",     // ชื่อ user ของคุณ
  host: "localhost",
  database: "airline",  // ชื่อ database
  password: "password", // รหัสผ่าน
  port: 5432
});

// ฟังก์ชันสร้างที่นั่ง
function generateSeats(totalSeats, planeId) {
  const seatMap = [];
  const seatLetters = ["A", "B", "C", "D", "E", "F"];
  const rows = Math.ceil(totalSeats / seatLetters.length);

  for (let row = 1; row <= rows; row++) {
    for (let letter of seatLetters) {
      const seatNumber = `${letter}${row}`;
      seatMap.push({ seatNumber, reserved: false, planeId });
      if (seatMap.length >= totalSeats) break;
    }
    if (seatMap.length >= totalSeats) break;
  }
  return seatMap;
}

// ✅ สร้างที่นั่งตามเครื่องบิน
app.post("/planes/:planeId/seats/init", async (req, res) => {
  const planeId = req.params.planeId;

  try {
    const planeResult = await pool.query("SELECT * FROM planes WHERE id = $1", [planeId]);
    const plane = planeResult.rows[0];

    if (!plane) return res.status(400).json({ error: "ไม่พบเครื่องบินนี้" });

    // ลบที่นั่งเก่าของเครื่องนี้ก่อน
    await pool.query("DELETE FROM seats WHERE plane_id = $1", [planeId]);

    // สร้างใหม่
    const seats = generateSeats(plane.total_seats, planeId);
    for (const seat of seats) {
      await pool.query(
        "INSERT INTO seats (seat_number, reserved, plane_id) VALUES ($1, $2, $3)",
        [seat.seatNumber, seat.reserved, seat.planeId]
      );
    }

    res.json({ message: `สร้างที่นั่งสำหรับ ${plane.name} สำเร็จ`, seats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

// ✅ จองที่นั่ง
app.post("/planes/:planeId/seats/reserve", async (req, res) => {
  const { seatNumber } = req.body;
  const planeId = req.params.planeId;

  try {
    const result = await pool.query(
      "SELECT * FROM seats WHERE seat_number = $1 AND plane_id = $2",
      [seatNumber, planeId]
    );
    const seat = result.rows[0];

    if (!seat) return res.status(400).json({ error: "ไม่มีที่นั่งนี้" });
    if (seat.reserved) return res.status(400).json({ error: "ที่นั่งนี้ถูกจองแล้ว" });

    await pool.query(
      "UPDATE seats SET reserved = TRUE WHERE id = $1",
      [seat.id]
    );

    res.json({ message: `จองที่นั่ง ${seatNumber} สำเร็จ` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

// ✅ ดูที่นั่งทั้งหมด
app.get("/planes/:planeId/seats", async (req, res) => {
  const planeId = req.params.planeId;

  try {
    const result = await pool.query(
      "SELECT * FROM seats WHERE plane_id = $1 ORDER BY seat_number",
      [planeId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

// ✅ ยกเลิกที่นั่ง
app.post("/planes/:planeId/seats/cancel", async (req, res) => {
  const { seatNumber } = req.body;
  const planeId = req.params.planeId;

  try {
    const result = await pool.query(
      "SELECT * FROM seats WHERE seat_number = $1 AND plane_id = $2",
      [seatNumber, planeId]
    );
    const seat = result.rows[0];

    if (!seat) return res.status(400).json({ error: "ไม่มีที่นั่งนี้" });
    if (!seat.reserved) return res.status(400).json({ error: "ที่นั่งยังไม่ได้ถูกจอง" });

    await pool.query(
      "UPDATE seats SET reserved = FALSE WHERE id = $1",
      [seat.id]
    );

    res.json({ message: `ยกเลิกการจองที่นั่ง ${seatNumber} สำเร็จ` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Seat API running with PostgreSQL at http://localhost:${PORT}`);
});
