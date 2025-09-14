const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.json());

// path ไฟล์ seats.json
const dataPath = path.join(__dirname, 'seats.json');

// ฟังก์ชันโหลดข้อมูล
function loadSeats() {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
}

// ฟังก์ชันบันทึกข้อมูล
function saveSeats(seats) {
  fs.writeFileSync(dataPath, JSON.stringify(seats, null, 2));
}

//  GET: ดูที่นั่งทั้งหมด
app.get('/seats', (req, res) => {
  const seats = loadSeats();
  res.json(seats);
});

//  POST: จองที่นั่ง
app.post('/seats/reserve', (req, res) => {
  const { seatId, passenger } = req.body;
  const seats = loadSeats();
  const seat = seats.find(s => s.seatId === seatId);

  if (!seat) {
    return res.status(404).json({ error: "Seat not found" });
  }
  if (seat.reserved) {
    return res.status(400).json({ error: "Seat already reserved" });
  }

  seat.reserved = true;
  seat.passenger = passenger;

  saveSeats(seats);
  res.json({ message: `Seat ${seatId} reserved for ${passenger}` });
});

// PUT: ย้ายที่นั่ง
app.put('/seats/move/:oldSeat/:newSeat', (req, res) => {
  const { passenger } = req.body;
  const seats = loadSeats();
  const oldSeat = seats.find(s => s.seatId === req.params.oldSeat);
  const newSeat = seats.find(s => s.seatId === req.params.newSeat);

  if (!oldSeat || !newSeat) {
    return res.status(404).json({ error: "Seat not found" });
  }
  if (!oldSeat.reserved || oldSeat.passenger !== passenger) {
    return res.status(400).json({ error: "You don't own the old seat" });
  }
  if (newSeat.reserved) {
    return res.status(400).json({ error: "New seat already reserved" });
  }

  oldSeat.reserved = false;
  oldSeat.passenger = null;

  newSeat.reserved = true;
  newSeat.passenger = passenger;

  saveSeats(seats);
  res.json({ message: `Moved ${passenger} from ${oldSeat.seatId} to ${newSeat.seatId}` });
});

//  DELETE: ยกเลิกที่นั่ง
app.delete('/seats/:seatId', (req, res) => {
  const seats = loadSeats();
  const seat = seats.find(s => s.seatId === req.params.seatId);

  if (!seat) {
    return res.status(404).json({ error: "Seat not found" });
  }
  if (!seat.reserved) {
    return res.status(400).json({ error: "Seat is not reserved" });
  }

  seat.reserved = false;
  seat.passenger = null;

  saveSeats(seats);
  res.json({ message: `Seat ${req.params.seatId} is now available` });
});

// Start server
app.listen(port, () => {
  console.log(`Seat reservation API running at http://localhost:${port}`);
});
