module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Fare', {
    price: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    departDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE },
    scrapedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
};