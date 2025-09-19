
const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); 

const flightRoutes = require('./flight/flight-airport');
const flightDateRoutes = require("./flight_date/routes/flightdateRoutes");
const bookingRoutes = require('./booking/routes/bookingRoutes');
const authRoutes = require("./auth/routes/auth");
const adminRoutes = require("./auth/routes/admin");
const { connect, sync } = require('./config/database');

// Connecting and syncing the database
async function initializeDatabase() {
  await connect();
  await sync();
}
initializeDatabase();

const app = express();

// Setting up middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setting up routes
app.use('/api/flight-airport', flightRoutes);
app.use("/api/flightDate", flightDateRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// Creating a server
app.listen(3000, () => {
  console.log('Listening on port 3000');
});