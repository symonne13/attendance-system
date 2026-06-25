import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful");

      // redirect after success
      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleSignup}
          style={{
            ...styles.btn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f1f5f9",
  },

  card: {
    background: "white",
    padding: 30,
    borderRadius: 12,
    width: 300,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },

  btn: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};