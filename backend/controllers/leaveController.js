const db = require("../config/db");

/* =======================
   APPLY LEAVE (EMPLOYEE)
======================= */
exports.applyLeave = (req, res) => {
  const userId = req.user.id;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: "Reason is required" });
  }

  const sql =
    "INSERT INTO leaves (user_id, reason, status) VALUES (?, ?, 'pending')";

  db.query(sql, [userId, reason], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("leave-updated", { message: "New leave request" });
    }

    return res.status(200).json({
      message: "Leave submitted successfully",
    });
  });
};

/* =======================
   GET ALL LEAVES (ADMIN)
======================= */
exports.getLeaves = (req, res) => {
  db.query("SELECT * FROM leaves ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    return res.status(200).json(results);
  });
};

/* =======================
   UPDATE LEAVE STATUS (FIXED)
======================= */
exports.updateLeaveStatus = (req, res) => {
  console.log("UPDATE REQUEST RECEIVED:", req.body);
  console.log("PARAMS:", req.params);

  const id = req.params.id;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      message: "Missing id or status",
    });
  }

  db.query(
    "UPDATE leaves SET status=? WHERE id=?",
    [status, id],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Leave not found",
        });
      }

      // keep the rest of your code here

      // =======================
      // GET USER FOR NOTIFICATION
      // =======================
      db.query(
        "SELECT user_id FROM leaves WHERE id=?",
        [id],
        (err, rows) => {
          if (!err && rows.length > 0) {
            const userId = rows[0].user_id;

            const cleanStatus = status.toLowerCase();

let message = "Your leave was REJECTED";
if (cleanStatus === "approved") {
  message = "Your leave was APPROVED";
}
            // SAVE NOTIFICATION
            db.query(
              "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
              [userId, message],
              (err) => {
                if (err) {
                  console.log("Notification insert error:", err);
                }
              }
            );

            // REAL-TIME NOTIFICATION
            const io = req.app.get("io");
            if (io) {
              io.to(userId.toString()).emit("notification", {
                message,
                status,
              });
            }
          }
        }
      );

      return res.json({ message: "Leave updated successfully" });
    }
  );
};

/* =======================
   DELETE LEAVE
======================= */
exports.deleteLeave = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  db.query("DELETE FROM leaves WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete leave request",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }

    return res.status(200).json({
      message: "Leave request deleted successfully",
    });
  });
};