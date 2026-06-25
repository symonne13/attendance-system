import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>HR SaaS</h2>

        <button onClick={() => navigate("/admin")} style={styles.btn}>
          Dashboard
        </button>

        <button onClick={() => navigate("/admin")} style={styles.btn}>
          Employees
        </button>

        <button onClick={() => navigate("/admin")} style={styles.btn}>
          Leaves
        </button>

        <button onClick={() => navigate("/user")} style={styles.btn}>
          My Panel
        </button>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <h3>Welcome, {user?.name}</h3>
          <p>{user?.role}</p>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial",
    background: "#f4f6f8",
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "white",
    padding: "20px",
  },

  logo: {
    marginBottom: "30px",
    color: "#fff",
  },

  btn: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    background: "#1f2937",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px",
    textAlign: "left",
  },

  logout: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    background: "red",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  topbar: {
    background: "white",
    padding: "15px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
  },

  content: {
    padding: "20px",
  },
};