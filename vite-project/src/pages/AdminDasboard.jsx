import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/students/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data);
      } else {
        alert(data.msg || "Failed to load students");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const deleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStudents();
      } else {
        const data = await res.json();
        alert(data.msg || "Failed to delete student");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const updateStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/students/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        setEditingId(null);
        fetchStudents();
      } else {
        const data = await res.json();
        alert(data.msg || "Failed to update student");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      
      <div className="dashboard-content">
        <div className="students-list">
          <h3>All Students ({students.length})</h3>
          <div className="students-grid">
            {students.map(student => (
              <div key={student._id} className="student-card">
                {editingId === student._id ? (
                  <div className="edit-form">
                    <input 
                      placeholder="Name"
                      value={editData.student || student.student} 
                      onChange={e => setEditData({...editData, student: e.target.value})}
                    />
                    <input 
                      placeholder="Email"
                      value={editData.email || student.email} 
                      onChange={e => setEditData({...editData, email: e.target.value})}
                    />
                    <input 
                      placeholder="Course"
                      value={editData.course || student.course} 
                      onChange={e => setEditData({...editData, course: e.target.value})}
                    />
                    <div className="card-actions">
                      <button className="btn-save" onClick={() => updateStudent(student._id)}>Save</button>
                      <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="student-info">
                      <p><strong>Name:</strong> {student.student}</p>
                      <p><strong>Email:</strong> {student.email}</p>
                      <p><strong>Course:</strong> {student.course}</p>
                      <p><strong>Enrolled:</strong> {new Date(student.enrollmentDate).toLocaleDateString()}</p>
                    </div>
                    <div className="card-actions">
                      <button className="btn-edit" onClick={() => {
                        setEditingId(student._id);
                        setEditData(student);
                      }}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteStudent(student._id)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}