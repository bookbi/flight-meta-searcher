**✈️ Flight Meta Searcher Backend**

Our Feature
ระบบ Backend สำหรับสายการบิน พัฒนาโดยใช้ Node.js + Express + Sequelize + PostgreSQL รองรับฟีเจอร์พื้นฐาน เช่น
1. register
2. flight airport
3. flight date
4. bookings
5. check-in


// Setting up routes
app.use('/api/flight-airport', flightRoutes);
app.use("/api/flightDate", flightDateRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seats", seatRoutes);


## Tech Stack
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Morgan (logger)
