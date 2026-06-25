
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  FaBell,
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUmbrellaBeach
} from "react-icons/fa";

const socket = io("http://localhost:5000");

export default function UserDashboard() {

  const [time, setTime] = useState("");
  const [status, setStatus] = useState("not-in");
  const [leaveReason, setLeaveReason] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  let user = { name: "User" };

  try {
    user = JSON.parse(localStorage.getItem("user")) || { name: "User" };
  } catch (e) {
    user = { name: "User" };
  }
const token = localStorage.getItem("token");
 
  /* ================= TIME ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= GET USER STATUS ================= */
  const fetchUserStatus = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/attendance/me",
        {
          headers: {
  Authorization: `Bearer ${token}`
}
     } );
      setStatus(res.data.status || "not-in");
    } catch (err) {
      console.log("STATUS ERROR:", err.response?.data || err.message);
    }
  };

  /* ================= NOTIFICATIONS ================= */
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUserStatus();
  }, []);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join", user.id);

    socket.on("leaveNotification", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: data.message,
          status: data.status
        },
        ...prev
      ]);
    });

    return () => {
      socket.off("leaveNotification");
    };
  }, []);

  /* ================= ATTENDANCE ================= */
  const handleCheckIn = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/attendance/in",
        {},
        { headers: { Authorization: `Bearer ${token}`} }
      );

      alert(res.data.message);
      fetchUserStatus();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/attendance/out",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      fetchUserStatus();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  /* ================= LEAVE ================= */
  const handleApplyLeave = async () => {
    if (!leaveReason) return alert("Enter reason");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/leave/apply",
        { reason: leaveReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setLeaveReason("");
      fetchNotifications();
    }catch (err) {
      alert(err.response?.data?.message || "Error submitting leave");
    }
  };

  /* ================= UI ================= */

  const statusColor =
    status === "active"
      ? "#22c55e"
      : status === "leave"
        ? "#facc15"
        : "#ef4444";

  const statusText =
    status === "active"
      ? "ACTIVE - IN OFFICE"
      : status === "leave"
        ? "ON LEAVE"
        : "NOT IN OFFICE";

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>HR SaaS</div>

        <div style={styles.profile}>
          <FaUserCircle size={42} />
          <div>
            <p>{user.name}</p>
            <small>Employee</small>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* TOP */}
        <div style={styles.topbar}>
          <h3>Welcome {user.name}</h3>

          <div style={styles.topRight}>
            <span>{time}</span>

            <div style={styles.notificationContainer}>
              <button
                style={styles.bellButton}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell color="#2563eb" />

                {notifications.length > 0 && (
                  <span style={styles.notificationBadge}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={styles.notificationDropdown}>
                  <h4>Notifications</h4>

                  {notifications.length === 0 ? (
                    <p>No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} style={styles.notificationItem}>
                        <div>{n.message}</div>
                        <small>{n.status}</small>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ATTENDANCE */}
        <div style={styles.card}>
          <h3>Attendance</h3>

          <div style={{ ...styles.status, background: statusColor }}>
            {statusText}
          </div>

          <div style={styles.row}>
            <button onClick={handleCheckIn} style={styles.green}>
              <FaSignInAlt /> Check In
            </button>

            <button onClick={handleCheckOut} style={styles.red}>
              <FaSignOutAlt /> Check Out
            </button>

            <button onClick={() => setStatus("leave")} style={styles.yellow}>
              <FaUmbrellaBeach /> Leave Mode
            </button>
          </div>
        </div>

        {/* LEAVE */}
        <div style={styles.card}>
          <h3>Leave Request</h3>

          <textarea
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            style={styles.textarea}
          />

          <button onClick={handleApplyLeave} style={styles.blue}>
            Submit
          </button>
        </div>

      </div>
    </div>
  );
};
  /* ================= STYLES ================= */

  const styles = {
    page: {
      display: "flex",
      height: "100vh",
      fontFamily: "Segoe UI",
      background: "#f1f5f9",
    },
    sidebar: {
      width: 250,
      background: "#0f172a",
      color: "white",
      padding: 20,
    },
    logo: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 30,
    },
    profile: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 20,
    },
    main: {
      flex: 1,
      padding: 20,
    },
    topbar: {
      display: "flex",
      justifyContent: "space-between",
      background: "white",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    },
    topRight: {
      display: "flex",
      gap: 15,
      alignItems: "center",
    },
    card: {
      background: "white",
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
    },
    status: {
      padding: 10,
      borderRadius: 8,
      color: "white",
      marginBottom: 10,
    },
    row: {
      display: "flex",
      gap: 10,
    },
    green: {
      background: "#22c55e",
      color: "white",
      padding: 10,
      border: "none",
      borderRadius: 8,
    },
    red: {
      background: "#ef4444",
      color: "white",
      padding: 10,
      border: "none",
      borderRadius: 8,
    },
    yellow: {
      background: "#facc15",
      padding: 10,
      border: "none",
      borderRadius: 8,
    },
    blue: {
      background: "#2563eb",
      color: "white",
      padding: 10,
      border: "none",
      borderRadius: 8,
    },
    textarea: {
      width: "100%",
      height: 80,
      padding: 10,
      borderRadius: 8,
      border: "1px solid #ccc",
      marginBottom: 10,
    },

    notificationContainer: {
      position: "relative",
    },
    bellButton: {
      background: "#eff6ff",
      border: "none",
      borderRadius: "50%",
      width: "42px",
      height: "42px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    notificationBadge: {
      position: "absolute",
      top: "-8px",
      right: "-8px",
      background: "#ef4444",
      color: "white",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
    },
    notificationDropdown: {
      position: "absolute",
      right: 0,
      top: "40px",
      width: "300px",
      background: "white",
      borderRadius: "12px",
      padding: "10px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      zIndex: 1000,
    },
    notificationItem: {
      padding: 10,
      borderBottom: "1px solid #eee",
    },
    notificationMessage: {
      fontWeight: 600,
    },
    notificationStatus: {
      fontSize: 13,
    },
  };

