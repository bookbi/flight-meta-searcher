**✈️ Flight Meta Searcher Backend**

Our Feature
ระบบ Backend สำหรับสายการบิน พัฒนาโดยใช้ Node.js + Express + Sequelize + PostgreSQL รองรับฟีเจอร์พื้นฐาน เช่น
1. register
2. flight airport
3. flight date
4. bookings
5. check-in


FLIGHT-META-SEARCHER/
├── check-in/                     # โมดูลเช็กอิน
│   └── migrateJsonToPostgres.js  # script migration
│   └── seatApi.js                # API จัดการที่นั่ง
│
├── config/                       # การตั้งค่าระบบ
│   ├── database.js               # เชื่อมต่อ PostgreSQL
│   ├── jwt.js                    # JWT helper
│   ├── planes.json               # ข้อมูล mockup เครื่องบิน
│   └── seats.json                # ข้อมูล mockup ที่นั่ง
│
├── controllers/                  # Logic ของ API
│   ├── admin_AuthController.js
│   ├── authController.js
│   ├── flight-airport.controller.js
│   └── flightDateControllers.js
│
├── middlewares/                  # Middleware เช่น Auth
│   └── authMiddleware.js
│
├── models/                       # Sequelize Models
│   ├── booking.js
│   ├── FlightAirport.js
│   ├── flightDate.js
│   ├── seatApi.js
│   └── User.js
│
├── routes/                       # Routes API
│   ├── admin_Auth.js
│   ├── auth.js
│   ├── bookingRoutes.js
│   ├── flight-airport.js
│   └── flightDateRoutes.js
│
├── services/                     # Business logic
│   ├── bookingService.js
│   ├── flight-airport.service.js
│   ├── flightDateService.js
│   └── userService.js
│
├── .env.example                  # Example env variables
├── .gitignore
├── app.js                        # Entry point ของ server
├── package.json
├── package-lock.json
└── README.md


// Setting up routes

app.use('/api/flight-airport', flightRoutes);

app.use("/api/flightDate", flightDateRoutes);

app.use('/api/bookings', bookingRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/seats", seatRoutes);


📡 API Endpoints
🔐 Authentication
POST /auth/register – สมัครสมาชิก
POST /auth/login – เข้าสู่ระบบ (คืน JWT Token)
GET /auth/me – ดูข้อมูลผู้ใช้ (ต้องใส่ Bearer Token)
✈️ Flight Airport
GET /api/flight-airport – ดูทั้งหมด
GET /api/flight-airport/:id – ดูตาม id
POST /api/flight-airport – เพิ่ม flight
PUT /api/flight-airport/:id – อัปเดต flight
DELETE /api/flight-airport/:id – ลบ flight
🗓️ Flight Dates
GET /api/flight-dates
POST /api/flight-dates
PUT /api/flight-dates/:id
DELETE /api/flight-dates/:id
🛫 Booking
POST /api/bookings – จองตั๋ว
GET /api/bookings/:id – ดูการจอง
🪑 Seat API
POST /planes/:planeId/seats/init – สร้างที่นั่งจากจำนวนที่นั่ง
POST /planes/:planeId/seats/reserve – จองที่นั่ง
POST /planes/:planeId/seats/cancel – ยกเลิกที่นั่ง
GET /seats – ดูที่นั่งทั้งหมด
🛠️ Tech Stack
Node.js + Express.js
PostgreSQL + Sequelize ORM
JWT Authentication
Morgan (Logger)


## Tech Stack
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Morgan (logger)
