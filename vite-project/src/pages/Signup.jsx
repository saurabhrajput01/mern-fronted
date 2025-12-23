import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [student, setStudent] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const submit = async () => {
    if (!student || !email || !course || !password) {
      alert("Please fill all fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("https://mern-backend-mzup.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student, email, course, password, role })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.role);
      } else {
        alert(data.msg || "Registration failed");
      }
    } catch (error) {
      alert("Network error - make sure backend is running");
    }
    setLoading(false);
  };

  return (
    <div className="box">
      <h2>Sign Up</h2>
      <input 
        placeholder="Full Name" 
        value={student}
        onChange={e=>setStudent(e.target.value)} 
      />
      <input 
        placeholder="Email" 
        type="email"
        value={email}
        onChange={e=>setEmail(e.target.value)} 
      />
      <input 
        placeholder="Course" 
        value={course}
        onChange={e=>setCourse(e.target.value)} 
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password}
        onChange={e=>setPassword(e.target.value)} 
      />
      <select onChange={e=>setRole(e.target.value)} value={role}>
        <option value="Student">Student</option>
        <option value="Admin">Admin</option>
      </select>
      <button onClick={submit} disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </div>
  );
}