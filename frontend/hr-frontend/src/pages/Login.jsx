import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async () => {
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    const { token, user } = res.data;

    // ✅ IMPORTANT: ensure token exists
    if (!token) {
      alert("No token received from server");
      return;
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("userId", user.id); // 🔥 ADD THIS (important for sockets)

    if (user.role === "admin") navigate("/admin");
    else navigate("/user");

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

 
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
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
    background: "#f5f5f5",
  },
  card: {
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};