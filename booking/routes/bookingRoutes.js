// booking/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const { Op } = require('sequelize');

// Generate booking reference
function generateBookingRef() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BK';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// GET all bookings with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { status, email, flightId, page = 1, limit = 10 } = req.query;
        const where = {};
        
        if (status) where.bookingStatus = status;
        if (email) where.passengerEmail = { [Op.iLike]: `%${email}%` };
        if (flightId) where.flightId = flightId;
        
        const offset = (page - 1) * limit;
        
        const bookings = await Booking.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            success: true,
            data: bookings.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: bookings.count,
                totalPages: Math.ceil(bookings.count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch bookings',
            message: error.message 
        });
    }
});

// GET booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found' 
            });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch booking',
            message: error.message 
        });
    }
});

// GET booking by reference
router.get('/reference/:reference', async (req, res) => {
    try {
        const booking = await Booking.findOne({
            where: { bookingReference: req.params.reference.toUpperCase() }
        });
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found' 
            });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch booking',
            message: error.message 
        });
    }
});

// POST create new booking
router.post('/', async (req, res) => {
    try {
        const { 
            passengerName, 
            passengerEmail, 
            passengerPhone,
            flightId, 
            seatNumber, 
            totalPrice,
            specialRequests 
        } = req.body;
        
        // Basic validation
        if (!passengerName || !passengerEmail || !flightId || !seatNumber) {
            return res.status(400).json({ 
                success: false,
                error: 'Missing required fields',
                required: ['passengerName', 'passengerEmail', 'flightId', 'seatNumber']
            });
        }
        
        // Check if seat is already booked
        const existingBooking = await Booking.findOne({
            where: {
                flightId,
                seatNumber,
                bookingStatus: { [Op.ne]: 'cancelled' }
            }
        });
        
        if (existingBooking) {
            return res.status(409).json({ 
                success: false,
                error: 'Seat already booked',
                message: `Seat ${seatNumber} is already booked for flight ${flightId}` 
            });
        }
        
        // Generate unique booking reference
        let bookingReference;
        let isUnique = false;
        while (!isUnique) {
            bookingReference = generateBookingRef();
            const existing = await Booking.findOne({ where: { bookingReference } });
            if (!existing) isUnique = true;
        }
        
        // Create booking
        const booking = await Booking.create({
            bookingReference,
            passengerName,
            passengerEmail,
            passengerPhone,
            flightId,
            seatNumber,
            totalPrice: totalPrice || 0.00,
            specialRequests,
            bookingStatus: 'confirmed'
        });
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
            bookingReference
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create booking',
            message: error.message 
        });
    }
});

// PUT update booking
router.put('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found' 
            });
        }
        
        // Don't allow updating critical fields for confirmed bookings
        const updateData = { ...req.body };
        if (booking.bookingStatus === 'confirmed') {
            delete updateData.flightId;
            delete updateData.seatNumber;
        }
        
        await booking.update(updateData);
        res.json({ 
            success: true, 
            message: 'Booking updated successfully', 
            data: booking 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update booking',
            message: error.message 
        });
    }
});

// PATCH update booking status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['confirmed', 'pending', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid status',
                validStatuses 
            });
        }
        
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found' 
            });
        }
        
        await booking.update({ bookingStatus: status });
        res.json({ 
            success: true, 
            message: `Booking status updated to ${status}`, 
            data: booking 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update booking status',
            message: error.message 
        });
    }
});

// DELETE booking (cancel)
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found' 
            });
        }
        
        await booking.update({ bookingStatus: 'cancelled' });
        res.json({ 
            success: true, 
            message: 'Booking cancelled successfully', 
            data: booking 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to cancel booking',
            message: error.message 
        });
    }
});

// GET passenger bookings
router.get('/passenger/:email', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { 
                passengerEmail: req.params.email,
                bookingStatus: { [Op.ne]: 'cancelled' }
            },
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            success: true,
            passengerEmail: req.params.email,
            data: bookings,
            totalBookings: bookings.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch passenger bookings',
            message: error.message 
        });
    }
});

// GET booking statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const [confirmed, pending, cancelled, totalRevenue] = await Promise.all([
            Booking.count({ where: { bookingStatus: 'confirmed' } }),
            Booking.count({ where: { bookingStatus: 'pending' } }),
            Booking.count({ where: { bookingStatus: 'cancelled' } }),
            Booking.sum('totalPrice', { where: { bookingStatus: 'confirmed' } })
        ]);
        
        res.json({
            success: true,
            data: {
                totalConfirmed: confirmed,
                totalPending: pending,
                totalCancelled: cancelled,
                totalBookings: confirmed + pending + cancelled,
                totalRevenue: totalRevenue || 0
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch statistics',
            message: error.message 
        });
    }
});

module.exports = router;