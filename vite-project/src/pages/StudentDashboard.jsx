import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function StudentDashboard() {
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/students/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setEditData(data);
      } else {
        alert(data.msg || "Failed to load profile");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/students/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        setEditing(false);
        fetchProfile();
      } else {
        const data = await res.json();
        alert(data.msg || "Failed to update profile");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Student Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      
      <div className="dashboard-content">
        <div className="profile">
          <h3>My Profile</h3>
          {editing ? (
            <div className="edit-form">
              <div>
                <label>Name:</label>
                <input 
                  value={editData.student || ""} 
                  onChange={e => setEditData({...editData, student: e.target.value})}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label>Email:</label>
                <input 
                  value={editData.email || ""} 
                  onChange={e => setEditData({...editData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label>Course:</label>
                <input 
                  value={editData.course || ""} 
                  onChange={e => setEditData({...editData, course: e.target.value})}
                  placeholder="Enter your course"
                />
              </div>
              <div className="profile-actions">
                <button className="btn-primary" onClick={updateProfile}>Save Changes</button>
                <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="profile-field">
                <strong>Name:</strong>
                <span>{profile.student}</span>
              </div>
              <div className="profile-field">
                <strong>Email:</strong>
                <span>{profile.email}</span>
              </div>
              <div className="profile-field">
                <strong>Course:</strong>
                <span>{profile.course}</span>
              </div>
              <div className="profile-field">
                <strong>Enrolled:</strong>
                <span>{profile.enrollmentDate && new Date(profile.enrollmentDate).toLocaleDateString()}</span>
              </div>
              <div className="profile-actions">
                <button className="btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}