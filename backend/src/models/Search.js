module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Search', {
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    departDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE },
    passengers: { type: DataTypes.INTEGER, defaultValue: 1 },
  });
};