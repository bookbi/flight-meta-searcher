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
    from: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    aircraft: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = FlightAirport;