const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
});

const Provider = require('./Provider')(sequelize, DataTypes);
const Route = require('./Route')(sequelize, DataTypes);
const Fare = require('./Fare')(sequelize, DataTypes);
const Search = require('./Search')(sequelize, DataTypes);
const AggregatedResult = require('./AggregatedResult')(sequelize, DataTypes);

// Relations
Provider.hasMany(Fare);
Fare.belongsTo(Provider);

Route.hasMany(Fare);
Fare.belongsTo(Route);

Search.hasOne(AggregatedResult);
AggregatedResult.belongsTo(Search);

module.exports = {
  sequelize,
  Provider,
  Route,
  Fare,
  Search,
  AggregatedResult,
};