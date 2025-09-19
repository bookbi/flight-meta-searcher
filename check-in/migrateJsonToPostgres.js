const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// PostgreSQL config
const pool = new Pool({
  user: "postgres",        // ชื่อ user ของคุณ
  host: "localhost",
  database: "airline",     // ชื่อ database
  password: "password",    // รหัสผ่าน
  port: 5432
});

// path ของ JSON files
const planesPath = path.join(__dirname, "..", "config", "planes.json");
const seatsPath = path.join(__dirname, "..", "config", "seats.json");

// ฟังก์ชัน main migration
async function migrate() {
  try {
    // โหลด JSON
    const planesJson = JSON.parse(fs.readFileSync(planesPath, "utf8"));
    const seatsJson = JSON.parse(fs.readFileSync(seatsPath, "utf8"));

    // แทรก planes
    await pool.query("DELETE FROM planes_data"); // ลบข้อมูลเก่า
    await pool.query("INSERT INTO planes_data (data) VALUES ($1)", [planesJson]);
    console.log("✅ planes.json migrate สำเร็จ");

    // แทรก seats
    await pool.query("DELETE FROM seats_data"); // ลบข้อมูลเก่า
    await pool.query("INSERT INTO seats_data (data) VALUES ($1)", [seatsJson]);
    console.log("✅ seats.json migrate สำเร็จ");

  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
  } finally {
    await pool.end();
  }
}

// เรียกใช้งาน
migrate();
