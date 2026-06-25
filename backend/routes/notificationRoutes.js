const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const db = require("../config/db");

router.get("/", auth, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

module.exports = router;