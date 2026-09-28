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

const buildStats = (students) => {
  const departmentMap = {};
  const yearMap = {};

  students.forEach((student) => {
    const department = normalizeDepartment(student.department);
    const year = student.enrollmentYear || 'Unknown';
    departmentMap[department] = (departmentMap[department] || 0) + 1;
    yearMap[year] = (yearMap[year] || 0) + 1;
  });

  return {
    totalStudents: students.length,
    activeStudents: students.filter((student) => Boolean(student.isActive)).length,
    inactiveStudents: students.filter((student) => !student.isActive).length,
    departmentStats: Object.entries(departmentMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    yearStats: Object.entries(yearMap)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => Number(a.year) - Number(b.year)),
  };
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

  const stats = useMemo(() => buildStats(students), [students]);
  const recentStudents = useMemo(
    () => [...students].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)).slice(0, 5),
    [students]
  );

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container">
          <div className="dashboard-hero-content">
            <span className="dashboard-kicker">Student Administration</span>
            <h1>Student Management Dashboard</h1>
            <p>Monitor student records, enrollment, and active status from one place.</p>
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
            ['Total Students', stats.totalStudents, 'All records'],
            ['Active Students', stats.activeStudents, 'Currently active'],
            ['Inactive Students', stats.inactiveStudents, 'Currently inactive'],
            ['Departments', stats.departmentStats.length, 'Unique departments'],
          ].map(([label, value, caption]) => (
            <div className="col-12 col-sm-6 col-xl-3" key={label}>
              <div className="dashboard-stat-card">
                <span>{label}</span>
                <strong>{loading ? '—' : value}</strong>
                <small>{caption}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="dashboard-panel h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3>Enrollment by Department</h3>
                  <p>Distribution calculated directly from the student records.</p>
                </div>
                <Link to="/Enroll" className="btn btn-sm btn-outline-primary">Track enrollment</Link>
              </div>
              {loading ? <p className="text-muted">Loading student records...</p> : stats.departmentStats.length ? (
                <div className="dashboard-list">
                  {stats.departmentStats.map((item) => {
                    const percentage = stats.totalStudents ? Math.round((item.count / stats.totalStudents) * 100) : 0;
                    return (
                      <div className="dashboard-list-item" key={item.name}>
                        <div className="d-flex justify-content-between">
                          <strong>{item.name}</strong>
                          <span>{item.count} ({percentage}%)</span>
                        </div>
                        <div className="progress mt-2" role="progressbar" aria-label={item.name} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
                          <div className="progress-bar" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-muted mb-0">No student records found.</p>}
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="dashboard-panel h-100">
              <h3>Enrollment by Year</h3>
              <p>Students grouped by their enrollment year.</p>
              {loading ? <p className="text-muted">Loading...</p> : stats.yearStats.length ? (
                <div className="dashboard-year-list">
                  {stats.yearStats.map((item) => (
                    <div className="dashboard-year-item" key={item.year}>
                      <span>{item.year}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted">No enrollment-year data found.</p>}
              <div className="dashboard-mini-summary mt-4">
                <span>Enrollment years</span>
                <strong>{stats.yearStats.length}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-panel mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3>Recent Student Records</h3>
              <p>Latest records based on the most recently created or updated data.</p>
            </div>
            <Link to="/students" className="btn btn-sm btn-outline-primary">View all</Link>
          </div>
          {loading ? <p className="text-muted">Loading records...</p> : recentStudents.length ? (
            <div className="dashboard-student-table-wrap">
              <table className="table dashboard-student-table align-middle mb-0">
                <thead>
                  <tr><th>Student</th><th>ID</th><th>Department</th><th>Year</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student._id || student.studentId}>
                      <td>
                        <strong>{student.firstName} {student.lastName}</strong>
                        <small>{student.email}</small>
                      </td>
                      <td>{student.studentId || '—'}</td>
                      <td>{normalizeDepartment(student.department)}</td>
                      <td>{student.enrollmentYear || '—'}</td>
                      <td><span className={`status-pill ${student.isActive ? 'active' : 'inactive'}`}>{student.isActive ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-muted mb-0">No student records available.</p>}
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
