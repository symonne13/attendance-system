const db = require("../config/db");

// APPLY LEAVE (MODEL)
exports.applyLeave = (userId, reason, callback) => {
  const sql =
    "INSERT INTO leaves (user_id, reason, status) VALUES (?, ?, 'pending')";
  db.query(sql, [userId, reason], callback);
};

// GET ALL LEAVES (MODEL)
exports.getAllLeaves = (callback) => {
  const sql = `
    SELECT 
      l.id,
      l.user_id,
      l.reason,
      l.status,
      l.created_at,
      e.name,
      e.email
    FROM leaves l
    LEFT JOIN employees e ON l.user_id = e.id
    ORDER BY l.id DESC
  `;

  db.query(sql, callback);
};

// UPDATE LEAVE STATUS (MODEL)
exports.updateStatus = (id, status, callback) => {
  const sql = "UPDATE leaves SET status=? WHERE id=?";
  db.query(sql, [status, id], callback);
};

// GET LEAVE BY ID
exports.getById = (id, callback) => {
  const sql = "SELECT * FROM leaves WHERE id=?";
  db.query(sql, [id], callback);
};