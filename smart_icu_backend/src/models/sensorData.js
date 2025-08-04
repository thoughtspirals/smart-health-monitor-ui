const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  // Array to store multiple sensor data over time
  sensor_values: [
    {
      timestamp: { type: Date, required: true }, // Timestamp for when the data is recorded
      temperature: { type: Number, required: true }, // Temperature value
      humidity: { type: Number, required: true }, // Humidity value
      ecg: { type: Number, required: true }, // ECG value
      spo2: { type: Number, required: true }, // SpO2 value
    },
  ],
  // Start time and end time to indicate the duration of the data collection
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
});

// Export the model for use in other files
module.exports = mongoose.model("SensorData", sensorSchema);
