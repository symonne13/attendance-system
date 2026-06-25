import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Landing from "./pages/Landing";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Signup from "./pages/Signup";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function RoleRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;
  return user.role === role ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING */}
        <Route path="/" element={<Landing />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

         <Route path="/Signup" element={<Signup />} />

        {/* ADMIN ONLY */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* USER ONLY */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <RoleRoute role="employee">
                <UserDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}