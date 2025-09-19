// booking/routes/bookingRoutes.js - Enhanced with validation
const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const BookingValidationService = require('../services/bookingService');
const { Op } = require('sequelize');

// GET all bookings with detailed info
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

// GET booking by ID with full details
router.get('/:id', async (req, res) => {
    try {
        const bookingDetails = await BookingValidationService.getBookingWithDetails(req.params.id);
        
        if (!bookingDetails) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found' 
            });
        }
        
        res.json({ 
            success: true, 
            data: bookingDetails 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch booking',
            message: error.message 
        });
    }
});

// POST create new booking with full validation
router.post('/', async (req, res) => {
    try {
        const { 
            passengerName, 
            passengerEmail, 
            passengerPhone,
            flightId, 
            flightDateId,
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

        // 🔍 Validate user email (จาก auth system)
        const user = await BookingValidationService.validateUser(passengerEmail);
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found',
                message: `Email ${passengerEmail} ไม่มีในระบบ กรุณาสมัครสมาชิกก่อน`
            });
        }

        // ✈️ Validate flight (จาก flight system)
        const flight = await BookingValidationService.validateFlight(flightId);
        if (!flight) {
            return res.status(400).json({
                success: false,
                error: 'Flight not found',
                message: `Flight ID ${flightId} ไม่มีในระบบ`
            });
        }

        // 📅 Validate flight date (จาก flight_date system) - optional
        let flightDate = null;
        if (flightDateId) {
            flightDate = await BookingValidationService.validateFlightDate(flightDateId);
            if (!flightDate) {
                return res.status(400).json({
                    success: false,
                    error: 'Flight date not found',
                    message: `Flight Date ID ${flightDateId} ไม่มีในระบบ`
                });
            }
        }

        // 🪑 Check seat availability
        const isAvailable = await BookingValidationService.checkSeatAvailability(
            flightId, 
            seatNumber, 
            flightDateId
        );
        
        if (!isAvailable) {
            return res.status(409).json({ 
                success: false,
                error: 'Seat already booked',
                message: `ที่นั่ง ${seatNumber} ถูกจองแล้วสำหรับเที่ยวบินนี้` 
            });
        }
        
        // 🎫 Generate unique booking reference
        let bookingReference;
        let isUnique = false;
        while (!isUnique) {
            bookingReference = BookingValidationService.generateBookingReference();
            const existing = await Booking.findOne({ where: { bookingReference } });
            if (!existing) isUnique = true;
        }
        
        // 💾 Create booking
        const booking = await Booking.create({
            bookingReference,
            userId: user.id,
            passengerName,
            passengerEmail,
            passengerPhone,
            flightId,
            flightDateId,
            seatNumber,
            totalPrice: totalPrice || 0.00,
            specialRequests,
            bookingStatus: 'confirmed'
        });
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
            bookingReference,
            validatedData: {
                user: user,
                flight: flight,
                flightDate: flightDate
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create booking',
            message: error.message 
        });
    }
});

// GET validate data endpoints (for testing)
router.get('/validate/user/:email', async (req, res) => {
    try {
        const user = await BookingValidationService.validateUser(req.params.email);
        res.json({
            success: true,
            exists: !!user,
            data: user || null
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Validation failed',
            message: error.message 
        });
    }
});

router.get('/validate/flight/:id', async (req, res) => {
    try {
        const flight = await BookingValidationService.validateFlight(req.params.id);
        res.json({
            success: true,
            exists: !!flight,
            data: flight || null
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Validation failed',
            message: error.message 
        });
    }
});

router.get('/validate/flightdate/:id', async (req, res) => {
    try {
        const flightDate = await BookingValidationService.validateFlightDate(req.params.id);
        res.json({
            success: true,
            exists: !!flightDate,
            data: flightDate || null
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Validation failed',
            message: error.message 
        });
    }
});

// GET enhanced statistics
router.get('/stats/detailed', async (req, res) => {
    try {
        const stats = await BookingValidationService.getDetailedStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch detailed statistics',
            message: error.message 
        });
    }
});

// PUT update booking (same as before but with validation)
router.put('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found' 
            });
        }
        
        // Validate email if being updated
        if (req.body.passengerEmail && req.body.passengerEmail !== booking.passengerEmail) {
            const user = await BookingValidationService.validateUser(req.body.passengerEmail);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid email',
                    message: `Email ${req.body.passengerEmail} ไม่มีในระบบ`
                });
            }
            req.body.userId = user.id;
        }
        
        await booking.update(req.body);
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

// Other routes remain the same...
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

module.exports = router;