// models/medicalHistory.js

const mongoose = require("mongoose");

const vitalSignSchema = new mongoose.Schema({
  time: String,
  heartRate: Number,
  bloodPressure: String,
  oxygenSaturation: Number,
});

const labResultSchema = new mongoose.Schema({
  testName: String,
  result: String,
  date: String,
});

const medicationSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  frequency: String,
  startDate: String,
});

const medicalHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    diagnosis: { type: String, required: true },
    admissionDate: { type: String, required: true },
    vitalSigns: [vitalSignSchema],
    labResults: [labResultSchema],
    medications: [medicationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);
