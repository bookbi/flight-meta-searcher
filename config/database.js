const { Sequelize } = require('sequelize');
const dbName = 'airport_db';
const dbUser = 'postgres';
const dbPassword = 'praewyaphat'; // replace with your actual password
const host = 'localhost';

const rootSequelize = new Sequelize(
  'postgres',dbUser,dbPassword,{
    host,
    dialect: 'postgres'
  }
);

const createDatabaseIfNotExists = async () => {
  try {
    await rootSequelize.authenticate();
    const [results] = await rootSequelize.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
    if (results.length === 0) {
      await rootSequelize.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
  }
  finally {
    await rootSequelize.close();
  }
};

const sequelize = new Sequelize(
  dbName, dbUser, dbPassword, {
    host: 'localhost',
    dialect: 'postgres'
  }
);

async function connect() {
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    console.log('Connection established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function sync() {
  try {
    await sequelize.sync();
    console.log('Connection synced successfully');
  } catch (error) {
    console.error('Unable to sync to the database:', error);
  }
}

module.exports = {
  sequelize,
  connect,
  sync
};
