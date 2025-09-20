// models/seatApi.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // ปรับ path

const Seat = sequelize.define('Seat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // ป้องกันซ้ำ
    },
    airplaneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'seats',
    timestamps: true
});

module.exports = Seat;
