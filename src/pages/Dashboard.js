import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllStudents } from '../api/studentAPI';
import './Dashboard.css';

const normalizeDepartment = (value) => {
  const department = String(value || 'Unknown').trim();
  if (!department) return 'Unknown';
  const key = department.toLowerCase();
  const names = { cse: 'CSE', ece: 'ECE', it: 'IT', aiml: 'AIML', cs: 'CS', mech: 'MECH', civil: 'CIVIL' };
  return names[key] || department.toUpperCase();
};

const StatIcon = ({ type }) => {
  const icons = {
    students: <><circle cx="9" cy="8" r="3.2" /><circle cx="17" cy="9" r="2.5" /><path d="M3.5 19c.7-3.6 2.6-5.4 5.5-5.4s4.8 1.8 5.5 5.4" /><path d="M14 15.2c2.7-.8 5.3.5 6.5 3.8" /></>,
    active: <><circle cx="10" cy="8" r="3.2" /><path d="M4 19c.7-3.6 2.7-5.4 6-5.4 2.1 0 3.8.8 4.9 2.5" /><circle cx="18" cy="17" r="4" fill="currentColor" stroke="none" /><path d="m16.2 17 1.2 1.2 2.4-2.6" stroke="#fff" strokeWidth="1.7" /></>,
    inactive: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19c.7-3.6 2.8-5.4 6.5-5.4s5.8 1.8 6.5 5.4" /><circle cx="18" cy="17" r="4" fill="currentColor" stroke="none" /><path d="M16.4 17h3.2" stroke="#fff" strokeWidth="1.8" /></>,
    departments: <><rect x="4" y="4" width="16" height="17" rx="2.5" /><path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2M10.5 21v-4h3v4" /></>
  };
  return <span className={"dashboard-stat-icon dashboard-stat-icon-" + type} aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{icons[type]}</svg></span>;
};

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllStudents();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected student API response.');
      }
      setStudents(data);
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setStudents([]);
      setError('Unable to load student records. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => ({
    total: students.length,
    active: students.filter((student) => Boolean(student.isActive)).length,
    inactive: students.filter((student) => !student.isActive).length,
    departments: new Set(students.map((student) => normalizeDepartment(student.department))).size,
    years: new Set(students.map((student) => student.enrollmentYear).filter(Boolean)).size,
  }), [students]);
  const recentStudents = useMemo(
    () => [...students].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)).slice(0, 5),
    [students]
  );

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container">
          <div className="dashboard-hero-content">
            <div className="dashboard-live-kicker" aria-label="Student Administration">
  <div className="dashboard-live-track">
    <span className="dashboard-live-item"><i></i> Student Administration</span>
    <span className="dashboard-live-item"><i></i> Student Administration</span>
    <span className="dashboard-live-item"><i></i> Student Administration</span>
  </div>
</div>
            <h1>Student Management Dashboard</h1>
            <p>Get a quick overview of your student records and jump into detailed management or enrollment analytics.</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link to="/students" className="btn btn-light">View Students</Link>
              <Link to="/add-student" className="btn btn-outline-light">+ Add Student</Link>
              <button type="button" className="btn btn-outline-light" onClick={loadDashboard}>↻ Refresh</button>
            </div>
          </div>
        </div>
      </section>

      <main className="container dashboard-content">
        {error && <div className="alert alert-warning">{error}</div>}

        <div className="row g-3 mb-4">
          {[
            ['Total Students', stats.total, 'All records', 'students'],
            ['Active Students', stats.active, 'Currently active', 'active'],
            ['Inactive Students', stats.inactive, 'Currently inactive', 'inactive'],
            ['Departments', stats.departments, 'Unique departments', 'departments'],
          ].map(([label, value, caption, icon]) => (
            <div className="col-12 col-sm-6 col-xl-3" key={label}>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-top">
                  <StatIcon type={icon} />
                  <span className="dashboard-stat-label">{label}</span>
                </div>
                <strong>{loading ? '—' : value}</strong>
                <small>{caption}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="dashboard-panel h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className="dashboard-section-kicker">RECENT ACTIVITY</span>
                  <h3>Recent Student Records</h3>
                  <p>Quick access to the latest student records.</p>
                </div>
                <Link to="/students" className="btn btn-sm btn-outline-primary">View all</Link>
              </div>
              {loading ? <p className="text-muted">Loading records...</p> : recentStudents.length ? (
                <div className="dashboard-student-table-wrap">
                  <table className="table dashboard-student-table align-middle mb-0">
                    <thead><tr><th>Student</th><th>ID</th><th>Department</th><th>Status</th></tr></thead>
                    <tbody>
                      {recentStudents.map((student) => (
                        <tr key={student._id || student.studentId}>
                          <td><strong>{student.firstName} {student.lastName}</strong><small>{student.email}</small></td>
                          <td>{student.studentId || '—'}</td>
                          <td>{normalizeDepartment(student.department)}</td>
                          <td><span className={`status-pill ${student.isActive ? 'active' : 'inactive'}`}>{student.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-muted mb-0">No student records available.</p>}
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="dashboard-panel dashboard-overview-panel h-100">
              <span className="dashboard-section-kicker">AT A GLANCE</span>
              <h3>Enrollment Snapshot</h3>
              <p>Detailed enrollment analysis is available on the dedicated Track Enrollment page.</p>
              <div className="snapshot-grid">
                <div><span>Students</span><strong>{loading ? '—' : stats.total}</strong></div>
                <div><span>Departments</span><strong>{loading ? '—' : stats.departments}</strong></div>
                <div><span>Enrollment years</span><strong>{loading ? '—' : stats.years}</strong></div>
              </div>
              <Link to="/Enroll" className="dashboard-analytics-link">
                <span><strong>Open Track Enrollment</strong><small>View charts and detailed breakdowns</small></span><b>→</b>
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-feature-grid mt-4">
          <div><h5>Student Records</h5><p>Search, filter, sort, edit, and manage all student information.</p></div>
          <div><h5>Student Profiles</h5><p>Open an individual student record for detailed academic information.</p></div>
          <div><h5>Enrollment Tracking</h5><p>Compare department and enrollment-year distribution from live records.</p></div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
