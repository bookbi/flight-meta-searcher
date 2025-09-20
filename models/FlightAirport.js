const { DataTypes } = require('sequelize');
const { sequelize }= require('../config/database');

const FlightAirport = sequelize.define('FlightAirport', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    flightno: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('flightno', value.toUpperCase());
        }
    },
    departure: {
        type: DataTypes.STRING(3),
        allowNull: false,
        set(value) {
            this.setDataValue('departure', value.toUpperCase());
        }
    },
    arrival: {
        type: DataTypes.STRING(3),
        allowNull: false,
        set(value) {
            this.setDataValue('arrival', value.toUpperCase());
        }
    },
    aircraft: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('aircraft', value.toUpperCase());
        }
    }
});

module.exports = FlightAirport;