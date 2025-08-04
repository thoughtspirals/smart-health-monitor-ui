const express = require("express");
const {
  storeSensorData, // Assuming this is renamed and handles all sensor data
  getSensorData, // Same as above
  getAlerts,
} = require("../../controllers/SensorDataControllers/ecgController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

module.exports = (io) => {
  // Route to store sensor data (ECG, Temperature, Humidity, SpO2)
  router.post("/sensor", (req, res) => storeSensorData(req, res, io));

  // Route to get the latest sensor data
  router.get("/sensor", getSensorData);

  // Route to get the latest alerts
  router.get("/alerts", getAlerts);

  router.post("/alerts", getAlerts);

  return router;
};
