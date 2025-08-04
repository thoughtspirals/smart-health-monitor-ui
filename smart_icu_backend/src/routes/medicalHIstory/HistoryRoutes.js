const {
  createMedicalHistory,
  getMyMedicalHistory,
} = require("../medicalHistory/medicalHistoryRoutes");

const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

// Create Medical History
router.post(
  "/user/create-medical-history",
  authMiddleware,
  createMedicalHistory
);

// View Medical History
router.get("/user/view-medical-history", authMiddleware, getMyMedicalHistory);

module.exports = router;
