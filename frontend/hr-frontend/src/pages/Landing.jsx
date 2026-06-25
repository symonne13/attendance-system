import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ATTENDANCE SYSTEM</h1>

        <p style={styles.subtitle}>
          Track attendance, manage employees, and handle leave efficiently
        </p>

        <div style={styles.buttonContainer}>
          <button style={styles.loginBtn} onClick={() => navigate("/login")}>
            Login
          </button>

          <button style={styles.signupBtn} onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial",
  },

  card: {
    background: "white",
    padding: "50px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
    width: "350px",
  },

  title: {
    marginBottom: "15px",
    color: "#333",
    fontSize: "28px",
    fontWeight: "bold",
  },

  subtitle: {
    marginBottom: "30px",
    color: "#666",
    fontSize: "14px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },

  loginBtn: {
    flex: 1,
    marginRight: "10px",
    padding: "12px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  signupBtn: {
    flex: 1,
    marginLeft: "10px",
    padding: "12px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};