const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  deleteLeave,
} = require("../controllers/leaveController");

/* =======================
   LEAVE ROUTES
======================= */

// Apply for leave
router.post("/apply", auth, applyLeave);

// Get all leaves
router.get("/all", auth, getLeaves);

// Update leave status


router.put("/update/:id", auth, updateLeaveStatus);

// Delete leave
router.delete("/:id", auth, deleteLeave);

module.exports = router;