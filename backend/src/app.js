require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const analysisRouter = require("./routes/analysis");
const { getApiKeys } = require("./utils/gemini");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
    allowedHeaders: ["Content-Type", "X-Client-Id"],
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  const databaseOk = mongoose.connection.readyState === 1;
  res.status(databaseOk ? 200 : 503).json({
    status: databaseOk ? "ok" : "unavailable",
    database: databaseOk,
    aiKeys: getApiKeys().length,
  });
});

app.use("/", analysisRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log("Unexpected error: " + err.message);
  res.status(500).json({ message: "Something went wrong" });
});

if (require.main === module) {
  connectDB()
    .then(() => {
      console.log("Database connected");
      app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
      });
    })
    .catch((err) => {
      console.log("Database connection failed: " + err.message);
      process.exit(1);
    });
}

module.exports = app;
