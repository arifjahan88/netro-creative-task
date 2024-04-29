const winston = require("winston");
const { MongoDB } = require("winston-mongodb");
const mongoose = require("mongoose");

// Create Winston Logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    // Log to MongoDB
    new MongoDB({
      db: process.env.MONGO_URL,
      collection: "system_logs",
      options: { useUnifiedTopology: true },
    }),
  ],
});

module.exports = logger;
