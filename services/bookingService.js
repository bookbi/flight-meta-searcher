// booking/services/bookingService.js
const { sequelize } = require('../../config/database');

class BookingService {
    
    static async validateUser(email) {
        try {
            const [result] = await sequelize.query(
                'SELECT id, "fullName", email FROM "Users" WHERE email = :email',
                { 
                    replacements: { email },
                    type: sequelize.QueryTypes.SELECT 
                }
            );
            return result || null;
        } catch (error) {
            console.error('User validation error:', error);
            return null;
        }
    }

    static async validateFlight(flightId) {
        try {
            const [result] = await sequelize.query(
                'SELECT * FROM "FlightAirports" WHERE id = :flightId',
                { 
                    replacements: { flightId },
                    type: sequelize.QueryTypes.SELECT 
                }
            );
            return result || null;
        } catch (error) {
            console.error('Flight validation error:', error);
            return null;
        }
    }

    static async validateFlightDate(flightDateId) {
        try {
            const [result] = await sequelize.query(
                'SELECT * FROM "FlightDates" WHERE id = :flightDateId',
                { 
                    replacements: { flightDateId },
                    type: sequelize.QueryTypes.SELECT 
                }
            );
            return result || null;
        } catch (error) {
            console.error('Flight date validation error:', error);
            return null;
        }
    }

    static async checkSeatAvailability(flightId, seatNumber, flightDateId = null) {
        try {
            let query = `
                SELECT id FROM bookings 
                WHERE "flightId" = :flightId 
                AND "seatNumber" = :seatNumber 
                AND "bookingStatus" != 'cancelled'
            `;
            
            const replacements = { flightId, seatNumber };
            
            if (flightDateId) {
                query += ' AND "flightDateId" = :flightDateId';
                replacements.flightDateId = flightDateId;
            }
            
            const results = await sequelize.query(query, {
                replacements,
                type: sequelize.QueryTypes.SELECT
            });
            
            return results.length === 0;
        } catch (error) {
            console.error('Seat availability error:', error);
            return false;
        }
    }

    static async getBookingWithDetails(bookingId) {
        try {
            const [result] = await sequelize.query(`
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
            `, {
                replacements: { bookingId },
                type: sequelize.QueryTypes.SELECT
            });
            
            return result || null;
        } catch (error) {
            console.error('Get booking details error:', error);
            throw error;
        }
    }

    static async getDetailedStats() {
        try {
            const [result] = await sequelize.query(`
                SELECT 
                    COUNT(*)::int as "totalBookings",
                    COUNT(CASE WHEN "bookingStatus" = 'confirmed' THEN 1 END)::int as "confirmedBookings",
                    COUNT(CASE WHEN "bookingStatus" = 'pending' THEN 1 END)::int as "pendingBookings",
                    COUNT(CASE WHEN "bookingStatus" = 'cancelled' THEN 1 END)::int as "cancelledBookings",
                    COALESCE(SUM(CASE WHEN "bookingStatus" = 'confirmed' THEN "totalPrice" ELSE 0 END), 0) as "totalRevenue",
                    COUNT(DISTINCT "flightId")::int as "uniqueFlights",
                    COUNT(DISTINCT "userId")::int as "uniqueUsers"
                FROM bookings
            `, {
                type: sequelize.QueryTypes.SELECT
            });
            
            return result;
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    }
}

module.exports = BookingService;