// booking/controllers/bookingController.js
const Booking = require('../models/booking');
const BookingService = require('../services/bookingService');
const { Op } = require('sequelize');

class BookingController {
    
    async getAllBookings(req, res) {
        try {
            const { status, email, flightId, page = 1, limit = 10 } = req.query;
            const where = {};
            
            if (status) where.bookingStatus = status;
            if (email) where.passengerEmail = { [Op.iLike]: `%${email}%` };
            if (flightId) where.flightId = flightId;
            
            const bookings = await Booking.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: (page - 1) * limit,
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
            this.handleError(res, 'Failed to fetch bookings', error);
        }
    }

    async getBookingById(req, res) {
        try {
            const booking = await BookingService.getBookingWithDetails(req.params.id);
            if (!booking) {
                return res.status(404).json({ success: false, error: 'Booking not found' });
            }
            res.json({ success: true, data: booking });
        } catch (error) {
            this.handleError(res, 'Failed to fetch booking', error);
        }
    }

    async getBookingByReference(req, res) {
        try {
            const booking = await Booking.findOne({
                where: { bookingReference: req.params.reference.toUpperCase() }
            });
            
            if (!booking) {
                return res.status(404).json({ success: false, error: 'Booking not found' });
            }

            const details = await BookingService.getBookingWithDetails(booking.id);
            res.json({ success: true, data: details });
        } catch (error) {
            this.handleError(res, 'Failed to fetch booking', error);
        }
    }

    async createBooking(req, res) {
        try {
            const { passengerName, passengerEmail, passengerPhone, flightId, flightDateId, seatNumber, totalPrice, specialRequests } = req.body;
            
            // Validation
            if (!passengerName || !passengerEmail || !flightId || !seatNumber) {
                return res.status(400).json({ 
                    success: false,
                    error: 'Missing required fields',
                    required: ['passengerName', 'passengerEmail', 'flightId', 'seatNumber']
                });
            }

            // Check user exists
            const user = await BookingService.validateUser(passengerEmail);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User not found',
                    message: `Email ${passengerEmail} ไม่มีในระบบ`
                });
            }

            // Check flight exists
            const flight = await BookingService.validateFlight(flightId);
            if (!flight) {
                return res.status(400).json({
                    success: false,
                    error: 'Flight not found',
                    message: `Flight ID ${flightId} ไม่มีในระบบ`
                });
            }

            // Check flight date if provided
            let flightDate = null;
            if (flightDateId) {
                flightDate = await BookingService.validateFlightDate(flightDateId);
                if (!flightDate) {
                    return res.status(400).json({
                        success: false,
                        error: 'Flight date not found',
                        message: `Flight Date ID ${flightDateId} ไม่มีในระบบ`
                    });
                }
            }

            // Check seat availability
            const isAvailable = await BookingService.checkSeatAvailability(flightId, seatNumber, flightDateId);
            if (!isAvailable) {
                return res.status(409).json({ 
                    success: false,
                    error: 'Seat already booked',
                    message: `ที่นั่ง ${seatNumber} ถูกจองแล้ว` 
                });
            }

            // Generate booking reference
            const bookingReference = await this.generateUniqueReference();
            
            // Create booking
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
                bookingReference
            });
        } catch (error) {
            this.handleError(res, 'Failed to create booking', error);
        }
    }

    async updateBooking(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.id);
            if (!booking) {
                return res.status(404).json({ success: false, error: 'Booking not found' });
            }
            
            // Validate email if being updated
            if (req.body.passengerEmail && req.body.passengerEmail !== booking.passengerEmail) {
                const user = await BookingService.validateUser(req.body.passengerEmail);
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
            res.json({ success: true, message: 'Booking updated successfully', data: booking });
        } catch (error) {
            this.handleError(res, 'Failed to update booking', error);
        }
    }

    async updateBookingStatus(req, res) {
        try {
            const { status } = req.body;
            const validStatuses = ['confirmed', 'pending', 'cancelled'];
            
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, error: 'Invalid status', validStatuses });
            }
            
            const booking = await Booking.findByPk(req.params.id);
            if (!booking) {
                return res.status(404).json({ success: false, error: 'Booking not found' });
            }
            
            await booking.update({ bookingStatus: status });
            res.json({ success: true, message: `Status updated to ${status}`, data: booking });
        } catch (error) {
            this.handleError(res, 'Failed to update status', error);
        }
    }

    async cancelBooking(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.id);
            if (!booking) {
                return res.status(404).json({ success: false, error: 'Booking not found' });
            }
            
            await booking.update({ bookingStatus: 'cancelled' });
            res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
        } catch (error) {
            this.handleError(res, 'Failed to cancel booking', error);
        }
    }

    async getPassengerBookings(req, res) {
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
            this.handleError(res, 'Failed to fetch passenger bookings', error);
        }
    }

    async getDetailedStats(req, res) {
        try {
            const stats = await BookingService.getDetailedStats();
            res.json({ success: true, data: stats });
        } catch (error) {
            this.handleError(res, 'Failed to fetch statistics', error);
        }
    }

    // Validation endpoints
    async validateUser(req, res) {
        try {
            const user = await BookingService.validateUser(req.params.email);
            res.json({ success: true, exists: !!user, data: user || null });
        } catch (error) {
            this.handleError(res, 'Validation failed', error);
        }
    }

    async validateFlight(req, res) {
        try {
            const flight = await BookingService.validateFlight(req.params.id);
            res.json({ success: true, exists: !!flight, data: flight || null });
        } catch (error) {
            this.handleError(res, 'Validation failed', error);
        }
    }

    async validateFlightDate(req, res) {
        try {
            const flightDate = await BookingService.validateFlightDate(req.params.id);
            res.json({ success: true, exists: !!flightDate, data: flightDate || null });
        } catch (error) {
            this.handleError(res, 'Validation failed', error);
        }
    }

    // Helper methods
    async generateUniqueReference() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let reference;
        let isUnique = false;
        
        while (!isUnique) {
            reference = 'BK' + Array.from({length: 6}, () => 
                chars.charAt(Math.floor(Math.random() * chars.length))
            ).join('');
            
            const existing = await Booking.findOne({ where: { bookingReference: reference } });
            if (!existing) isUnique = true;
        }
        
        return reference;
    }

    handleError(res, message, error) {
        res.status(500).json({ 
            success: false, 
            error: message,
            message: error.message 
        });
    }
}

module.exports = new BookingController();