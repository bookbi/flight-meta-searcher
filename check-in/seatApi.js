const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ path ของไฟล์ json config
const seatsPath = path.join(__dirname, "..", "config", "seats.json");
const planesPath = path.join(__dirname, "..", "config", "planes.json");

// โหลด/บันทึกข้อมูล seats
function loadSeats() {
  if (!fs.existsSync(seatsPath)) return [];
  return JSON.parse(fs.readFileSync(seatsPath, "utf8"));
}

function saveSeats(data) {
  fs.writeFileSync(seatsPath, JSON.stringify(data, null, 2));
}

// โหลด planes
function loadPlanes() {
  if (!fs.existsSync(planesPath)) return [];
  return JSON.parse(fs.readFileSync(planesPath, "utf8"));
}

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

// ✅ API: เลือกเครื่องบิน และสร้างที่นั่ง
app.post("/planes/:planeId/seats/init", (req, res) => {
  const planeId = req.params.planeId;
  const planes = loadPlanes();
  const plane = planes.find((p) => p.id === planeId);

  if (!plane) {
    return res.status(400).json({ error: "ไม่พบเครื่องบินนี้" });
  }

  const seats = generateSeats(plane.totalSeats, planeId);
  saveSeats(seats);

  res.json({ message: `สร้างที่นั่งสำหรับ ${plane.name} สำเร็จ`, seats });
});

// ✅ API: จองที่นั่ง
app.post("/planes/:planeId/seats/reserve", (req, res) => {
  const { seatNumber } = req.body;
  const planeId = req.params.planeId;

  if (!seatNumber) {
    return res.status(400).json({ error: "กรุณาระบุ seatNumber" });
  }

  let seats = loadSeats();
  const seat = seats.find((s) => s.seatNumber === seatNumber && s.planeId === planeId);

  if (!seat) {
    return res.status(400).json({ error: "หมายเลขที่นั่งไม่ถูกต้องหรือไม่ตรงกับเครื่องบิน" });
  }

  if (seat.reserved) {
    return res.status(400).json({ error: "ที่นั่งนี้ถูกจองแล้ว" });
  }

  seat.reserved = true;

  saveSeats(seats);

  res.json({ message: `จองที่นั่ง ${seatNumber} สำเร็จ`, seat });
});

// ✅ API: ดูที่นั่งทั้งหมด
app.get("/seats", (req, res) => {
  const seats = loadSeats();
  res.json(seats);
});

// ✅ API: ยกเลิกที่นั่ง
app.post("/planes/:planeId/seats/cancel", (req, res) => {
  const { seatNumber } = req.body;
  const planeId = req.params.planeId;

  let seats = loadSeats();
  const seat = seats.find((s) => s.seatNumber === seatNumber && s.planeId === planeId);

  if (!seat) {
    return res.status(400).json({ error: "หมายเลขที่นั่งไม่ถูกต้องหรือไม่ตรงกับเครื่องบิน" });
  }

  if (!seat.reserved) {
    return res.status(400).json({ error: "ที่นั่งนี้ยังไม่ได้ถูกจอง" });
  }

  seat.reserved = false;

  saveSeats(seats);

  res.json({ message: `ยกเลิกการจองที่นั่ง ${seatNumber} สำเร็จ`, seat });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Seat API running at http://localhost:${PORT}`);
});
