import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={styles.nav}>
      <h3>HR System</h3>

      <div>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/admin">Admin</Link>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    background: "#2c3e50",
    color: "white",
  },
};