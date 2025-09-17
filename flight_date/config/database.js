const { Sequelize } = require("sequelize");

// 🔹 ตั้งค่าการเชื่อมต่อ PostgreSQL
const sequelize = new Sequelize(
  "airport_db", // ชื่อ database
  "postgres",                      // username
  "0000",                      // password เปลี่ยนเป็นของคุณ
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,                // ปิด log SQL ถ้าอยาก
  }
);

// 🔹 ทดสอบการเชื่อมต่อ
async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
}

// 🔹 Sync database กับ model (สร้างตารางถ้ายังไม่มี)
async function sync() {
  try {
    await sequelize.sync({ alter: true }); // alter:true จะปรับโครงสร้างตารางอัตโนมัติ
    console.log("Database synced successfully!");
  } catch (err) {
    console.error("Error syncing database:", err);
  }
}

module.exports = { sequelize, connect, sync };
