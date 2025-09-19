const express = require('express');
const router = express.Router();
const FlightAirport = require('./models/FlightAirport');

router.get('/', async (req, res) => {
    try {
        const flightAirportData = await FlightAirport.findAll();
        res.status(200).json({ message: 'เรียกดูข้อมูลเที่ยวบินทั้งหมดสำเร็จ', data: flightAirportData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const flightAirport = await FlightAirport.findByPk(id);

        if (flightAirport) {
            res.json(flightAirport);
        } else {
            res.status(404).json({ error: 'FlightAirport not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { flightno, departure, arrival, aircraft } = req.body;
        
        if (!flightno || !departure || !arrival || !aircraft) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (departure.toUpperCase() === arrival.toUpperCase()) {
            return res.status(400).json({ error: 'Departure and arrival cannot be the same' });
        }

        const newFlightAirport = await FlightAirport.create({
            flightno,
            departure: departure.toUpperCase(),
            arrival: arrival.toUpperCase(),
            aircraft
        });
        res.status(201).json(newFlightAirport);
        res.status(201).json({ message: 'เพิ่มเที่ยวบินสำเร็จ', data: newFlightAirport });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create flightAirport' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {departure, arrival} = req.body;
        if (departure && arrival && departure.toUpperCase() === arrival.toUpperCase()) {
            return res.status(400).json({ error: 'Departure and arrival cannot be the same' });
        }
        
        const [updated] = await FlightAirport.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedFlightAirport = await FlightAirport.findOne({ where: { id: req.params.id } });
            res.status(200).json({ message: 'แก้ไขเที่ยวบินสำเร็จ', updatedFlightAirport});
        } else {
            res.status(404).json({ error: 'FlightAirport not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update data' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deleted = await FlightAirport.destroy({
            where: {id}
        });
        if (deleted) {
            res.status(204).end();
            res.json({ message: 'ยกเลิกเที่ยวบินนี้สำเร็จ' });
        } else {
            res.status(404).json({ error: 'FlightAirport not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete data' });
    }
});

module.exports = router;
