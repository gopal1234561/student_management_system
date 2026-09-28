import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddStudent.css';

const API_URL = (process.env.REACT_APP_API_URL || 'https://student-management-system-1-cw3r.onrender.com').replace(/\/$/, '');

const departmentOptions = ['CSE', 'ECE', 'IT', 'AIML', 'MECH', 'CS', 'CIVIL'];

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
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post(API_URL + '/students', formData);
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (err) {
      console.error('Add Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="add-student-page">
      <div className="add-student-container">
        <div className="add-student-header">
          <span className="add-student-kicker">STUDENT RECORDS</span>
          <h1>Add New Student</h1>
          <p>Create a student record using the available academic and personal details.</p>
        </div>

        <form onSubmit={handleSubmit} className="add-student-form">
          <section className="student-form-section">
            <div className="student-form-section-heading">
              <div>
                <span>01</span>
                <div>
                  <h2>Student Information</h2>
                  <p>Basic identification and contact details.</p>
                </div>
              </div>
            </div>

            <div className="student-form-grid">
              <div className="student-field">
                <label htmlFor="studentId">Student ID <span>*</span></label>
                <input id="studentId" name="studentId" placeholder="e.g. CBIT001" value={formData.studentId} onChange={handleChange} required />
              </div>

              <div className="student-field">
                <label htmlFor="email">Email <span>*</span></label>
                <input id="email" name="email" type="email" placeholder="student@example.com" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="student-field">
                <label htmlFor="firstName">First Name <span>*</span></label>
                <input id="firstName" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required />
              </div>

              <div className="student-field">
                <label htmlFor="lastName">Last Name <span>*</span></label>
                <input id="lastName" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required />
              </div>

              <div className="student-field">
                <label htmlFor="dob">Date of Birth <span>*</span></label>
                <input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
              </div>
            </div>
          </section>

          <section className="student-form-section">
            <div className="student-form-section-heading">
              <div>
                <span>02</span>
                <div>
                  <h2>Academic Information</h2>
                  <p>Department and enrollment details.</p>
                </div>
              </div>
            </div>

            <div className="student-form-grid">
              <div className="student-field">
                <label htmlFor="department">Department <span>*</span></label>
                <select id="department" name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select department</option>
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>

              <div className="student-field">
                <label htmlFor="enrollmentYear">Enrollment Year <span>*</span></label>
                <input id="enrollmentYear" name="enrollmentYear" type="number" min="2000" max="2100" placeholder="e.g. 2026" value={formData.enrollmentYear} onChange={handleChange} required />
              </div>
            </div>
          </section>

          <section className="student-form-section student-status-section">
            <div className="student-status-copy">
              <div className="student-status-icon">✓</div>
              <div>
                <h2>Student Status</h2>
                <p>Active students are included in active-student statistics.</p>
              </div>
            </div>
            <label className="student-active-toggle">
              <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
              <span className="student-toggle-track"><span /></span>
              <span>Is Active</span>
            </label>
          </section>

          <div className="add-student-actions">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/students')} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Adding Student...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddStudent;
