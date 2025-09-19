// booking/services/bookingService.js - ตรวจสอบข้อมูลจาก database จริง
const { sequelize } = require('../../config/database');
const Booking = require('../models/booking');

class BookingValidationService {
    
    // เช็ค User จาก auth system (register)
    static async validateUser(email) {
        try {
            const [results] = await sequelize.query(
                'SELECT id, "fullName", email FROM "Users" WHERE email = :email',
                {
                    replacements: { email },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            return results;
        } catch (error) {
            console.error('Error validating user:', error);
            return null;
        }
    }

    
    static async validateFlight(flightId) {
        try {
            const [results] = await sequelize.query(
                'SELECT * FROM "FlightAirports" WHERE id = :flightId',
                {
                    replacements: { flightId },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            return results;
        } catch (error) {
            console.error('Error validating flight:', error);
            return null;
        }
    }

    
    static async validateFlightDate(flightDateId) {
        try {
            const [results] = await sequelize.query(
                'SELECT * FROM "FlightDates" WHERE id = :flightDateId',
                {
                    replacements: { flightDateId },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            return results;
        } catch (error) {
            console.error('Error validating flight date:', error);
            return null;
        }
    }

    // เช็คว่า seat ถูกจองแล้วหรือยัง
    static async checkSeatAvailability(flightId, seatNumber, flightDateId = null) {
        try {
            let query = `
                SELECT * FROM bookings 
                WHERE "flightId" = :flightId 
                AND "seatNumber" = :seatNumber 
                AND "bookingStatus" != 'cancelled'
            `;
            
            const replacements = { flightId, seatNumber };
            
            if (flightDateId) {
                query += ' AND "flightDateId" = :flightDateId';
                replacements.flightDateId = flightDateId;
            }
            
            const [results] = await sequelize.query(query, {
                replacements,
                type: sequelize.QueryTypes.SELECT
            });
            
            return results.length === 0; // true = available, false = taken
        } catch (error) {
            console.error('Error checking seat availability:', error);
            return false;
        }
    }

    // สร้าง booking reference
    static generateBookingReference() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'BK';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // ดึงข้อมูลแบบรวม (booking พร้อมข้อมูลที่เกี่ยวข้อง)
    static async getBookingWithDetails(bookingId) {
        try {
            const query = `
                SELECT 
                    b.*,
                    u."fullName" as userFullName,
                    u.email as userEmail,
                    f.flightno,
                    f."from" as flightFrom,
                    f."to" as flightTo,
                    f.aircraft,
                    fd."from" as dateFrom,
                    fd."to" as dateTo,
                    fd.date as flightDate,
                    fd."departureTime",
                    fd."arrivalTime"
                FROM bookings b
                LEFT JOIN "Users" u ON b."userId" = u.id
                LEFT JOIN "FlightAirports" f ON b."flightId" = f.id
                LEFT JOIN "FlightDates" fd ON b."flightDateId" = fd.id
                WHERE b.id = :bookingId
            `;
            
            const [results] = await sequelize.query(query, {
                replacements: { bookingId },
                type: sequelize.QueryTypes.SELECT
            });
            
            return results;
        } catch (error) {
            console.error('Error getting booking details:', error);
            throw error;
        }
    }

    // ดึงสถิติแบบละเอียด
    static async getDetailedStats() {
        try {
            const query = `
                SELECT 
                    COUNT(*) as totalBookings,
                    COUNT(CASE WHEN "bookingStatus" = 'confirmed' THEN 1 END) as confirmedBookings,
                    COUNT(CASE WHEN "bookingStatus" = 'pending' THEN 1 END) as pendingBookings,
                    COUNT(CASE WHEN "bookingStatus" = 'cancelled' THEN 1 END) as cancelledBookings,
                    SUM(CASE WHEN "bookingStatus" = 'confirmed' THEN "totalPrice" ELSE 0 END) as totalRevenue,
                    COUNT(DISTINCT "flightId") as uniqueFlights,
                    COUNT(DISTINCT "userId") as uniqueUsers
                FROM bookings
            `;
            
            const [results] = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT
            });
            
            return results[0];
        } catch (error) {
            console.error('Error getting detailed stats:', error);
            throw error;
        }
    }
}

module.exports = BookingValidationService;