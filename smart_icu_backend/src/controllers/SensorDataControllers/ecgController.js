const SensorData = require("../../models/sensorData");
const redisClient = require("../../config/redis");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const CACHE_KEY = "recent_sensor_data";
const ALERTS_KEY = "recent_alerts";
const SENSOR_RETENTION_MS = 300000; // 5 minutes

const CRITICAL_THRESHOLDS = {
  temperature: { min: 25, max: 45 },
  humidity: { min: 20, max: 80 },
  ecg: { min: 150, max: 900 },
  spo2: { min: 90, max: 100 },
};

const checkCriticalValues = (reading) => {
  const alerts = [];

  for (const key in CRITICAL_THRESHOLDS) {
    const value = reading[key];
    const { min, max } = CRITICAL_THRESHOLDS[key];

    if (value < min || value > max) {
      alerts.push({
        type: key,
        message: `${key.toUpperCase()} is out of range: ${value}`,
        severity: "Critical",
        time: new Date(),
        status: "Active",
      });
    }
  }

  return alerts;
};

const getLastSensorDocId = async () => {
  try {
    return await redisClient.get("lastSensorDocId");
  } catch (err) {
    console.error("❌ Redis GET Error:", err);
    return null;
  }
};

const setLastSensorDocId = async (id) => {
  try {
    await redisClient.set("lastSensorDocId", id.toString());
  } catch (err) {
    console.error("❌ Redis SET Error:", err);
  }
};

exports.storeSensorData = async (req, res, io) => {
  try {
    console.log("📥 Incoming Sensor Data:", req.body);
    const { temperature, humidity, ecg, spo2 } = req.body;

    if (
      temperature === undefined ||
      humidity === undefined ||
      ecg === undefined ||
      spo2 === undefined
    ) {
      return res.status(400).json({
        error:
          "All sensor values (temperature, humidity, ecg, spo2) are required",
      });
    }

    const newReading = {
      timestamp: new Date(),
      temperature,
      humidity,
      ecg,
      spo2,
    };

    let lastSensorDocId = await getLastSensorDocId();
    let lastSensorDoc = lastSensorDocId
      ? await SensorData.findById(lastSensorDocId)
      : null;

    if (
      !lastSensorDoc ||
      Date.now() - new Date(lastSensorDoc.start_time).getTime() >
        SENSOR_RETENTION_MS
    ) {
      lastSensorDoc = await SensorData.create({
        sensor_values: [newReading],
        start_time: new Date(),
        end_time: new Date(),
      });
      await setLastSensorDocId(lastSensorDoc._id);
    } else {
      await SensorData.findByIdAndUpdate(
        lastSensorDoc._id,
        {
          $push: { sensor_values: newReading },
          end_time: new Date(),
        },
        { new: true }
      );
    }

    // Update sensor cache
    let cachedReadings = JSON.parse(await redisClient.get(CACHE_KEY)) || [];
    cachedReadings.unshift(newReading);
    if (cachedReadings.length > 30) cachedReadings.pop();
    await redisClient.set(CACHE_KEY, JSON.stringify(cachedReadings));

    // Check for critical alerts
    const alerts = checkCriticalValues(newReading);
    if (alerts.length > 0) {
      let cachedAlerts = JSON.parse(await redisClient.get(ALERTS_KEY)) || [];
      alerts.forEach((alert) => {
        alert.id = Date.now() + Math.random(); // unique id
        alert.patient = "Sanskar"; // Update if patient info available
      });
      cachedAlerts.unshift(...alerts);
      if (cachedAlerts.length > 50) cachedAlerts = cachedAlerts.slice(0, 50);
      await redisClient.set(ALERTS_KEY, JSON.stringify(cachedAlerts));

      if (io) {
        console.log("🚨 Sending alerts to frontend:", alerts);
        io.emit("sensor_alerts", alerts);
      }
    }

    if (io) {
      io.emit("live_sensor_data", cachedReadings);
    }

    res.status(201).json({ message: "Sensor Data Stored Successfully!" });
  } catch (error) {
    console.error("❌ Error storing sensor data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSensorData = async (req, res) => {
  try {
    let latestReadings = JSON.parse(await redisClient.get(CACHE_KEY));
    if (!latestReadings || latestReadings.length === 0) {
      latestReadings = await SensorData.aggregate([
        { $unwind: "$sensor_values" },
        { $sort: { "sensor_values.timestamp": -1 } },
        { $limit: 30 },
        {
          $project: {
            _id: 0,
            temperature: "$sensor_values.temperature",
            humidity: "$sensor_values.humidity",
            ecg: "$sensor_values.ecg",
            spo2: "$sensor_values.spo2",
            timestamp: "$sensor_values.timestamp",
          },
        },
      ]);
      await redisClient.set(CACHE_KEY, JSON.stringify(latestReadings));
    }

    res.status(200).json(latestReadings);
  } catch (error) {
    console.error("❌ Error fetching sensor data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    let alerts = JSON.parse(await redisClient.get(ALERTS_KEY)) || [];
    res.status(200).json(alerts);
  } catch (err) {
    console.error("❌ Error fetching alerts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
