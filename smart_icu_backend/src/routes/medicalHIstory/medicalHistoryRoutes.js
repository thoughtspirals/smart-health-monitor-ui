// controllers/patient/medicalHistoryController.js

const MedicalHistory = require("../../models/medicalHistory"); // Ensure the correct path

// Create Medical History
const createMedicalHistory = async (req, res) => {
  try {
    const { diagnosis, admissionDate, vitalSigns, labResults, medications } =
      req.body;

    if (!diagnosis || !admissionDate) {
      return res
        .status(400)
        .json({ message: "Diagnosis and Admission Date are required" });
    }

    const newMedicalHistory = new MedicalHistory({
      user: req.user._id, // Assuming 'req.user' is set by authMiddleware
      diagnosis,
      admissionDate,
      vitalSigns,
      labResults,
      medications,
    });

    await newMedicalHistory.save();

    res.status(201).json({
      message: "Medical history created successfully",
      medicalHistory: newMedicalHistory,
    });
  } catch (error) {
    console.error("Error creating medical history:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get My Medical History
const getMyMedicalHistory = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({ user: req.user._id });

    if (!medicalHistory) {
      return res.status(404).json({ message: "No medical history found" });
    }

    res.status(200).json({ medicalHistory });
  } catch (error) {
    console.error("Error fetching medical history:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Export both functions from the same file
module.exports = {
  createMedicalHistory,
  getMyMedicalHistory,
};
