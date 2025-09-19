// booking/models/booking.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database'); // Goes up 2 levels to your main config

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bookingReference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passengerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passengerEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passengerPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    flightId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    seatNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bookingStatus: {
        type: DataTypes.ENUM('confirmed', 'pending', 'cancelled'),
        defaultValue: 'confirmed'
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    specialRequests: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

module.exports = Booking;