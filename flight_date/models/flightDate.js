const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // import sequelize instance จาก db.js

// Model FlightDate
const FlightDate = sequelize.define("FlightDate", {
  from: { type: DataTypes.STRING, allowNull: false },
  to: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  departureTime: { type: DataTypes.TIME, allowNull: false },
  arrivalTime: { type: DataTypes.TIME, allowNull: false }
  }, {
  timestamps: false
});

module.exports = FlightDate;
