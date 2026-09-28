import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditStudent.css';

const API_URL = (process.env.REACT_APP_API_URL || 'https://student-management-system-1-cw3r.onrender.com').replace(/\/$/, '');
const departmentOptions = ['CSE', 'ECE', 'IT', 'AIML', 'MECH', 'CS', 'CIVIL'];

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '', firstName: '', lastName: '', email: '', dob: '',
    department: '', enrollmentYear: '', isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL + '/students/' + id);
        const student = res.data;
        const formattedDob = student.dob ? new Date(student.dob).toISOString().split('T')[0] : '';
        setFormData({
          studentId: student.studentId || '',
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          email: student.email || '',
          dob: formattedDob,
          department: student.department || '',
          enrollmentYear: student.enrollmentYear || '',
          isActive: Boolean(student.isActive),
        });
      } catch (err) {
        console.error('Error fetching student:', err);
        toast.error('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

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
      await axios.put(API_URL + '/students/' + id, formData);
      toast.success('Student updated successfully');
      navigate('/students');
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main className="edit-student-page"><div className="edit-student-container"><div className="edit-loading">Loading student details...</div></div></main>;
  }

  return (
    <main className="edit-student-page">
      <div className="edit-student-container">
        <div className="edit-student-header">
          <span className="edit-student-kicker">STUDENT RECORDS</span>
          <h1>Edit Student</h1>
          <p>Update the student record. Existing empty fields are kept empty unless you choose to fill them.</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-student-form">
          <section className="edit-form-section">
            <div className="edit-form-heading"><span>01</span><div><h2>Student Information</h2><p>Identification and contact details.</p></div></div>
            <div className="edit-form-grid">
              <div className="edit-field"><label htmlFor="studentId">Student ID <span>*</span></label><input id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required /></div>
              <div className="edit-field"><label htmlFor="email">Email <span>*</span></label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
              <div className="edit-field"><label htmlFor="firstName">First Name <span>*</span></label><input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
              <div className="edit-field"><label htmlFor="lastName">Last Name <span>*</span></label><input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
              <div className="edit-field"><label htmlFor="dob">Date of Birth <span>*</span></label><input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required /></div>
            </div>
          </section>

          <section className="edit-form-section">
            <div className="edit-form-heading"><span>02</span><div><h2>Academic Information</h2><p>Department and enrollment details.</p></div></div>
            <div className="edit-form-grid">
              <div className="edit-field"><label htmlFor="department">Department <span>*</span></label><select id="department" name="department" value={formData.department} onChange={handleChange} required><option value="">Select department</option>{departmentOptions.map((department) => <option key={department} value={department}>{department}</option>)}</select></div>
              <div className="edit-field"><label htmlFor="enrollmentYear">Enrollment Year <span>*</span></label><input id="enrollmentYear" name="enrollmentYear" type="number" min="2000" max="2100" value={formData.enrollmentYear} onChange={handleChange} required /></div>
            </div>
          </section>

          <section className="edit-form-section edit-status-section">
            <div className="edit-status-copy"><div className="edit-status-icon">✓</div><div><h2>Student Status</h2><p>Active students are included in active-student statistics.</p></div></div>
            <label className="edit-active-toggle"><input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} /><span className="edit-toggle-track"><span /></span><span>Is Active</span></label>
          </section>

          <div className="edit-student-actions">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/students')} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving Changes...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditStudent;
