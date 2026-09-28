import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEnrollments, getStudentById } from '../api/studentAPI';

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [studentData, enrollmentData] = await Promise.all([getStudentById(id), getEnrollments()]);
        setStudent(studentData);
        const records = Array.isArray(enrollmentData) ? enrollmentData : [];
        setEnrollments(records.filter((item) => item.student?._id === id || item.student === id));
      } catch (err) {
        setError('Unable to load this student. The record may not exist.');
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="container mt-5 text-center">Loading student details...</div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div><Link to="/students" className="btn btn-primary">Back to Students</Link></div>;
  if (!student) return null;

  return (
    <main className="container mt-4 mb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div><h2 className="mb-1">Student Profile</h2><p className="text-muted mb-0">Student details and linked course enrollment records</p></div>
        <div><Link to="/students" className="btn btn-outline-secondary me-2">Back</Link><Link to="/course-enrollment" className="btn btn-primary me-2">Enroll in Course</Link><Link to={'/edit-student/' + student._id} className="btn btn-warning">Edit</Link></div>
      </div>

      <div className="card shadow-sm mb-4"><div className="card-body p-4"><div className="row g-4">
        <div className="col-12 col-md-6"><h5 className="text-primary mb-3">Personal Information</h5><p><strong>Student ID:</strong> {student.studentId || 'N/A'}</p><p><strong>Name:</strong> {student.firstName || ''} {student.lastName || ''}</p><p><strong>Email:</strong> {student.email || 'N/A'}</p><p><strong>Date of Birth:</strong> {student.dob ? String(student.dob).slice(0, 10) : 'N/A'}</p></div>
        <div className="col-12 col-md-6"><h5 className="text-primary mb-3">Academic Information</h5><p><strong>Department:</strong> {student.department || 'N/A'}</p><p><strong>Enrollment Year:</strong> {student.enrollmentYear || 'N/A'}</p><p><strong>Status:</strong> <span className={'badge ' + (student.isActive ? 'bg-success' : 'bg-secondary')}>{student.isActive ? 'Active' : 'Inactive'}</span></p></div>
      </div></div></div>

      <section className="card shadow-sm"><div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><div><h5 className="text-primary mb-1">Course Enrollment</h5><p className="text-muted mb-0">All course records linked to this student</p></div><Link to="/enrollment-history" className="btn btn-outline-primary btn-sm">View Full History</Link></div>
        {enrollments.length ? <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Course</th><th>Credits</th><th>Semester</th><th>Academic Year</th><th>Status</th></tr></thead><tbody>{enrollments.map((item) => <tr key={item._id}><td><strong>{item.course?.courseCode || '—'}</strong><small className="d-block text-muted">{item.course?.courseName || 'Course unavailable'}</small></td><td>{item.course?.credits ?? '—'}</td><td>{item.semester || '—'}</td><td>{item.academicYear || '—'}</td><td><span className={'badge ' + (item.status === 'Completed' ? 'bg-success' : item.status === 'Dropped' ? 'bg-danger' : 'bg-primary')}>{item.status || 'Enrolled'}</span></td></tr>)}</tbody></table></div> : <div className="text-center text-muted py-4">No course enrollments for this student yet. <Link to="/course-enrollment">Enroll this student</Link>.</div>}
      </div></section>
    </main>
  );
};

export default StudentDetails;
