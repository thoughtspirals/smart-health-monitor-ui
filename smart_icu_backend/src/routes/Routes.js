const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

//unauthorized routes
const login = require("./User/user-handlers/login.js");
const register = require("./User/user-handlers/register.js");
const logout = require("./User/user-handlers/logout.js");
const getMyProfile = require("./User/user-handlers/viewProfile.js");

router.post("/api/v1/user/login", [
  body("email").isEmail().withMessage("Invalid email adress"),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  login,
]);

router.post(
  "/api/v1/user/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  register
);

//authenticated routes
router.post("/api/v1/user/logout", authMiddleware, logout); // Logout user

router.get("/user/view-profile", authMiddleware, getMyProfile);

module.exports = router;
