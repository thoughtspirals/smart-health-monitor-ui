const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

const getMyProfile = async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    const user = req.user;

    // Send back user details (excluding password)
    const { password, resetPasswordToken, resetPasswordExpires, ...userData } =
      user.toObject();

    res.status(200).json({ user: userData });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

module.exports = getMyProfile;
