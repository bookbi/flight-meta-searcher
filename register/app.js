const express = require("express");
const morgan = require("morgan");
const { connect, sync } = require("./config/database");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

// database init
(async () => {
  await connect();
  await sync();
})();

// routes
app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
