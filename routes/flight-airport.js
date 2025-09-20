const express = require('express');
const flightAirportController = require('../controllers/flight-airport.controller');

const router = express.Router();

router.get('/', flightAirportController.list);
router.get('/:id', flightAirportController.get);
router.post('/', flightAirportController.create);
router.put('/:id', flightAirportController.update);
router.delete('/:id', flightAirportController.remove);

module.exports = router;
