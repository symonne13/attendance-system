import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // 🔥 FIX: always get latest token (IMPORTANT)
  

const fetchData = useCallback(async () => {
    try {
      const emp = await axios.get("http://localhost:5000/api/employees");

      const lev = await axios.get("http://localhost:5000/api/leave/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setEmployees(emp.data);
      setLeaves(lev.data);
    } catch (err) {
      console.log("API ERROR:", err.response?.data || err.message);
    }
  }, []);

 useEffect(() => {
  fetchData();
}, [fetchData]);
  const deleteLeave = async (id) => {
    if (!window.confirm("Delete this leave request?")) return;

    console.log("Deleting leave ID:", id);

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("DELETE SUCCESS RESPONSE:", res.data);

      await fetchData();
      alert("Leave deleted successfully");
    } catch (err) {
      console.log("FULL DELETE ERROR:", err);
      console.log("Server response:", err.response?.data);
      console.log("Status:", err.response?.status);

      alert(err.response?.data?.message || "Failed to delete leave");
    }
  };



const updateLeave = async (id, status) => {
  try {
    console.log("Sending update request:", { id, status });

    const res = await axios.put(
      `http://localhost:5000/api/leave/update/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("SUCCESS:", res.data);

    alert("Leave updated successfully");
    fetchData();
  } catch (err) {
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);

    alert(
      JSON.stringify(err.response?.data) ||
      err.message ||
      "Update failed"
    );
  }
};

  const getStatusColor = (status) => {
    if (status === "pending") return "#f59e0b";
    if (status === "approved") return "#22c55e";
    if (status === "rejected") return "#ef4444";
    return "#6b7280";
  };

  return (
    <DashboardLayout>
      <div style={styles.page}>
        <h2 style={styles.title}>Admin Dashboard</h2>

        {/* STATS */}
        <div style={styles.stats}>
          <div style={styles.card}>
            <h3>Employees</h3>
            <p>{employees.length}</p>
          </div>

          <div style={styles.card}>
            <h3>Total Leaves</h3>
            <p>{leaves.length}</p>
          </div>
        </div>

        {/* LEAVES TABLE */}
        <div style={styles.tableCard}>
          <h3>Leave Requests</h3>

          {leaves.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No leave requests</p>
          ) : (
            leaves.map((l) => (
              <div key={l.id} style={styles.row}>
                <div>
                  <b>User ID:</b> {l.user_id}
                  <br />
                  <span style={{ opacity: 0.7 }}>{l.reason}</span>
                </div>

                {/* STATUS */}
                <div
                  style={{
                    ...styles.status,
                    background: getStatusColor(l.status),
                  }}
                >
                  {l.status.toUpperCase()}
                </div>

                {/* ACTIONS */}
                <div style={styles.actions}>
                  <button
                    onClick={() => updateLeave(l.id, "approved")}
                    style={styles.approveBtn}
                    disabled={l.status === "approved"}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateLeave(l.id, "rejected")}
                    style={styles.rejectBtn}
                    disabled={l.status === "rejected"}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => deleteLeave(l.id)}
                    style={{
                      background: "#444",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ================= UI STYLES ================= */

const styles = {
  page: {
    padding: 20,
    fontFamily: "Segoe UI",
  },

  title: {
    marginBottom: 20,
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
    marginBottom: 20,
  },

  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  tableCard: {
    background: "white",
    padding: 20,
    borderRadius: 12,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottom: "1px solid #eee",
  },

  status: {
    padding: "6px 12px",
    borderRadius: 20,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    gap: 10,
  },

  approveBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  rejectBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
};