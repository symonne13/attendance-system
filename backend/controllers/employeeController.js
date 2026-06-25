const db = require("../config/db");

// CREATE
exports.createEmployee = (req, res) => {
  const { name, position, salary } = req.body;

  const sql = "INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)";

  db.query(sql, [name, position, salary], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Employee added" });
  });
};

// READ ALL
exports.getEmployees = (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

// UPDATE
exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, position, salary } = req.body;

  const sql = "UPDATE employees SET name=?, position=?, salary=? WHERE id=?";

  db.query(sql, [name, position, salary, id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Employee updated" });
  });
};

// DELETE
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM employees WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Employee deleted" });
  });
};

exports.getEmployeeById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(result[0]);
  });
};