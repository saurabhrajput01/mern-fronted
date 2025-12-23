import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const submit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("https://mern-backend-mzup.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.role);
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (error) {
      alert("Network error - make sure backend is running");
    }
    setLoading(false);
  };

  return (
    <div className="box">
      <h2>Login</h2>
      <input 
        placeholder="Email" 
        type="email"
        value={email}
        onChange={e=>setEmail(e.target.value)} 
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password}
        onChange={e=>setPassword(e.target.value)} 
      />
      <button onClick={submit} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
