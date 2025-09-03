module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Route', {
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
  });
};