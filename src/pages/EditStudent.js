import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/students/${id}`);
        const student = res.data;
        const formattedDob = new Date(student.dob).toISOString().split('T')[0];

        setFormData({
          ...student,
          dob: formattedDob,
        });
      } catch (err) {
        console.error('Error fetching student:', err);
        toast.error('Failed to fetch student data');
      }
    };

    fetchStudent();
  }, [id]);

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
      await axios.put(`${process.env.REACT_APP_API_URL}/students/${id}`, formData);
      toast.success('Student updated successfully');
      navigate('/students');
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      toast.error('Failed to update student');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Student</h2>
      <form onSubmit={handleSubmit}>
        <input name="studentId" placeholder="Student ID" value={formData.studentId} onChange={handleChange} className="form-control mb-2" required />
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="form-control mb-2" required />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="form-control mb-2" required />
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="form-control mb-2" required />
        <input name="dob" placeholder="Date of Birth" type="date" value={formData.dob} onChange={handleChange} className="form-control mb-2" required />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="form-control mb-2" required />
        <input name="enrollmentYear" placeholder="Enrollment Year" type="number" value={formData.enrollmentYear} onChange={handleChange} className="form-control mb-2" required />
        <div className="form-check mb-2">
          <input name="isActive" type="checkbox" className="form-check-input" checked={formData.isActive} onChange={handleChange} />
          <label className="form-check-label">Is Active</label>
        </div>
        <button type="submit" className="btn btn-primary">Update Student</button>
      </form>
    </div>
  );
};

export default EditStudent;


