const express = require('express');
const c = require('../controllers/flight-airport.controller');

const router = express.Router();

router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
