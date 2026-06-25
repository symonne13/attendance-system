const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  checkIn,
  checkOut,
  getMyStatus,
} = require("../controllers/attendanceController");

router.post("/in", auth, checkIn);
router.post("/out", auth, checkOut);
router.get("/me", auth, getMyStatus);

module.exports = router;