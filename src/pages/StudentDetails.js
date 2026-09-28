import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStudentById } from '../api/studentAPI';

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getStudentById(id);
        setStudent(data);
      } catch (err) {
        console.error('Unable to load student:', err);
        setError('Unable to load this student. The record may not exist.');
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [id]);

  if (loading) return <div className="container mt-5 text-center">Loading student details...</div>;

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/students" className="btn btn-primary">Back to Students</Link>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h2 className="mb-1">Student Profile</h2>
          <p className="text-muted mb-0">Complete student record</p>
        </div>
        <div>
          <Link to="/students" className="btn btn-outline-secondary me-2">Back</Link>
          <Link to={`/edit-student/${student._id}`} className="btn btn-warning">Edit</Link>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h5 className="text-primary mb-3">Personal Information</h5>
              <p><strong>Student ID:</strong> {student.studentId || 'N/A'}</p>
              <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
              <p><strong>Email:</strong> {student.email || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {student.dob ? String(student.dob).slice(0, 10) : 'N/A'}</p>
            </div>
            <div className="col-12 col-md-6">
              <h5 className="text-primary mb-3">Academic Information</h5>
              <p><strong>Department:</strong> {student.department || 'N/A'}</p>
              <p><strong>Enrollment Year:</strong> {student.enrollmentYear || 'N/A'}</p>
              <p><strong>Status:</strong> <span className={`badge ${student.isActive ? 'bg-success' : 'bg-secondary'}`}>{student.isActive ? 'Active' : 'Inactive'}</span></p>
              <p><strong>Record ID:</strong> <small>{student._id}</small></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
