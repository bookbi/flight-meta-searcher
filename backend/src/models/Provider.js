module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Provider', {
    name: { type: DataTypes.STRING, allowNull: false },
    baseUrl: { type: DataTypes.STRING },
  });
};