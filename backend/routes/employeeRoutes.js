const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL EMPLOYEES (Admin Dashboard)
router.get("/", (req, res) => {
  const sql = "SELECT id, name, email, role FROM employees";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

module.exports = router;