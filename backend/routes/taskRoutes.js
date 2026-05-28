const express = require("express");
const { body, param, query } = require("express-validator");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const statusValues = ["Pending", "Completed"];

router.get(
  "/",
  protect,
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be at least 1"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("search")
      .optional()
      .trim()
      .isString()
      .withMessage("Search must be a string"),
    query("status")
      .optional()
      .isIn(statusValues)
      .withMessage("Status must be Pending or Completed"),
  ],
  validateRequest,
  getTasks,
);

// CREATE TASK
router.post(
  "/",
  protect,
  [
    body("title")
      .exists()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be 500 characters or fewer"),
    body("status")
      .optional()
      .isIn(statusValues)
      .withMessage("Status must be Pending or Completed"),
  ],
  validateRequest,
  createTask,
);

// UPDATE TASK
router.put(
  "/:id",
  protect,
  [
    param("id").isMongoId().withMessage("Invalid task id"),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be 500 characters or fewer"),
    body("status")
      .optional()
      .isIn(statusValues)
      .withMessage("Status must be Pending or Completed"),
  ],
  validateRequest,
  updateTask,
);

// DELETE TASK
router.delete(
  "/:id",
  protect,
  [param("id").isMongoId().withMessage("Invalid task id")],
  validateRequest,
  deleteTask,
);

module.exports = router;
