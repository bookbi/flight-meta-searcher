const express = require("express");
const bodyParser = require("body-parser");
const { connect, sync } = require("./config/database");
const flightDateRoutes = require("./routes/flightdateRoutes");

const app = express();
app.use(bodyParser.json());

// initialize DB
async function initializeDatabase() {
  await connect();
  await sync();
}
initializeDatabase();

// ใช้งาน router
app.use("/api/flight-dates", flightDateRoutes);

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
