const { DataTypes } = require('sequelize');
const { sequelize }= require('../config/database');

const FlightAirport = sequelize.define('FlightAirport', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    flightno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departure: {
        type: DataTypes.STRING,
        allowNull: false
    },
    arrival: {
        type: DataTypes.STRING,
        allowNull: false
    },
    aircraft: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = FlightAirport;