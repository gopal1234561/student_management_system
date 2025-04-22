import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddStudent.css';
const AddStudent = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    department: '',
    enrollmentYear: '',
    isActive: true,
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/students`, formData);
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (err) {
      console.error('Add Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Failed to add student');
    }
  };
  return (
    <div className="container mt-4">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit}>
        <input name="studentId" placeholder="Student ID" value={formData.studentId} onChange={handleChange} className="form-control mb-2" required />
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="form-control mb-2" required />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="form-control mb-2" required />
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="form-control mb-2" required />
        <input name="dob" type="date" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} className="form-control mb-2" required />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="form-control mb-2" required />
        <input name="enrollmentYear" type="number" placeholder="Enrollment Year" value={formData.enrollmentYear} onChange={handleChange} className="form-control mb-2" required />
        <div className="form-check mb-2">
          <input name="isActive" type="checkbox" className="form-check-input" checked={formData.isActive} onChange={handleChange} />
          <label className="form-check-label">Is Active</label>
        </div>
        <button type="submit" className="btn btn-success">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
