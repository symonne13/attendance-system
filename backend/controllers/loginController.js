const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT * FROM employees WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    // compare password
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  });
};