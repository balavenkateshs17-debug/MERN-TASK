const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const validateRequest = require("../middleware/validateRequest");

const {
  signup,
  login,
} = require("../controllers/authController");

router.post(
  "/signup",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").trim().isEmail().withMessage("Email must be valid").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  signup
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Email must be valid").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login
);

module.exports = router;
