const express = require('express');
const morgan = require('morgan');

const flightRoutes = require('./flight/flight-airport');
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setting up routes
app.use('/api/flight-airport', flightRoutes);

// Creating a server
app.listen(3000, () => {
  console.log('Listening on port 3000');
});