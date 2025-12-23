import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDasboard";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css";

function App() {
  const { role } = useContext(AuthContext);

  if (!role) {
    return (
      <div className="auth-container">
        <Login />
        <div className="divider">OR</div>
        <Signup />
      </div>
    );
  }

  return (
    <div className="app">
      {role === "Admin" ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  );
}

export default App;