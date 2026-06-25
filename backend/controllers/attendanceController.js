const db = require("../config/db");

// ================= CHECK IN =================
exports.checkIn = (req, res) => {
  const userId = req.user.id;
  const io = req.app.get("io");
io.emit("attendance-updated");

  // prevent double check-in
  const checkSql =
    "SELECT * FROM attendance WHERE employee_id=? AND DATE(check_in)=CURDATE()";

  db.query(checkSql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });

    if (rows.length > 0) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const sql =
      "INSERT INTO attendance (employee_id, check_in, status) VALUES (?, NOW(), 'active')";

    db.query(sql, [userId], (err) => {
      if (err) return res.status(500).json({ message: err.message });

      db.query(
        "UPDATE employees SET current_status='active' WHERE id=?",
        [userId],
        (err2) => {
          if (err2)
            return res.status(500).json({ message: err2.message });

          const io = req.app.get("io");

          // send only to admin room OR general event
          io.emit("attendance-update", {
            userId,
            status: "active",
          });

          return res.json({
            message: "Checked in successfully",
            status: "active",
          });
        }
      );
    });
  });
};

// ================= CHECK OUT =================
exports.checkOut = (req, res) => {
  const userId = req.user.id;
const io = req.app.get("io");
io.emit("attendance-updated");
  const sql = `
    UPDATE attendance 
    SET check_out = NOW(), status = 'not-in'
    WHERE employee_id = ? AND DATE(check_in) = CURDATE()
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "No check-in record found for today",
      });
    }

    db.query(
      "UPDATE employees SET current_status='not-in' WHERE id=?",
      [userId],
      (err2) => {
        if (err2)
          return res.status(500).json({ message: err2.message });

        const io = req.app.get("io");

        io.emit("attendance-update", {
          userId,
          status: "not-in",
        });

        return res.json({
          message: "Checked out successfully",
          status: "not-in",
        });
      }
    );
  });
};
exports.getMyStatus = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT status FROM attendance WHERE employee_id = ? ORDER BY id DESC LIMIT 1",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length === 0) {
        return res.json({ status: "not-in" });
      }

      return res.json(rows[0]);
    }
  );
};