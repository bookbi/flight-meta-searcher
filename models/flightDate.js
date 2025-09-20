const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // import sequelize instance จาก db.js

// Model FlightDate
const FlightDate = sequelize.define("FlightDate", {
  departure: { type: DataTypes.STRING(3),
        allowNull: false,
        validate: { is: /^[A-Z]{3}$/ },
        set(value) {
            this.setDataValue('departure', value.toUpperCase());
        } },
  arrival: { type: DataTypes.STRING(3),
        allowNull: false,
        validate: { is: /^[A-Z]{3}$/ },
        set(value) {
            this.setDataValue('arrival', value.toUpperCase());
        }
   },
  date: { type: DataTypes.DATE, allowNull: false },
  departureTime: { type: DataTypes.TIME, allowNull: false },
  arrivalTime: { type: DataTypes.TIME, allowNull: false }
  }, {
  timestamps: false
});

module.exports = FlightDate;
