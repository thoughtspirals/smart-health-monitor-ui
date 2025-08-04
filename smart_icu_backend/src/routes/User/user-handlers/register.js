const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    phone,
    age,
    patientId,
    gender,
    bloodType,
  } = req.body;
  let token = null; // Initialize token

  // Validate input
  if (!name || !email || !password || !phone || !confirmPassword) {
    return res.status(400).json({
      message: "Name, email, confirmPassword and password are required",
    });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log(`Registration attempt for existing user: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      user = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        age,
        gender,
        bloodType,
        patientId,
      });
      await user.save();

      // Generate JWT token
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set token in a cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false, // Set to false for local development
      });

      // Log successful signup with timestamp
      console.log({
        message: `User signed up successfully`,
        email: user.email,
        userId: user._id,
        age: user.age,
        patientId: user.patientId,
        gender: user.gender,
        bloodType: user.bloodType,
        timestamp: new Date().toISOString(),
      });
    }

    // Respond with token and user data
    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Error in register:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // More specific error messages
    let errorMessage = "Server error";
    if (error.name === "ValidationError") {
      errorMessage =
        "Validation error: " +
        Object.values(error.errors)
          .map((val) => val.message)
          .join(", ");
    } else if (error.name === "MongoServerError") {
      errorMessage = "Database error";
    } else if (error.name === "BcryptError") {
      errorMessage = "Password encryption error";
    }

    res.status(500).json({
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = register;
