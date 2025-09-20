// booking/routes/bookingRoutes.js - Clean version with Controller
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Main booking routes
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.get('/reference/:reference', bookingController.getBookingByReference);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.cancelBooking);

// Passenger routes
router.get('/passenger/:email', bookingController.getPassengerBookings);

// Statistics routes
router.get('/stats/detailed', bookingController.getDetailedStats);

// Validation routes (for testing/debugging)
router.get('/validate/user/:email', bookingController.validateUser);
router.get('/validate/flight/:id', bookingController.validateFlight);
router.get('/validate/flightdate/:id', bookingController.validateFlightDate);

module.exports = router;