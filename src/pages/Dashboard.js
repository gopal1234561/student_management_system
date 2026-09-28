import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllStudents, getEnrollmentStats } from '../api/studentAPI';
import './Dashboard.css';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, departmentStats: [], yearStats: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const [studentData, statsData] = await Promise.all([getAllStudents(), getEnrollmentStats()]);
        setStudents(Array.isArray(studentData) ? studentData : []);
        setStats({
          totalStudents: statsData?.totalStudents || 0,
          departmentStats: statsData?.departmentStats || [],
          yearStats: statsData?.yearStats || [],
        });
      } catch (err) {
        console.error('Dashboard loading error:', err);
        setError('Dashboard data could not be loaded. You can still use the student management pages.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const activeStudents = useMemo(() => students.filter((student) => student.isActive).length, [students]);
  const inactiveStudents = Math.max(students.length - activeStudents, 0);
  const departmentCount = stats.departmentStats.length;
  const yearCount = stats.yearStats.length;

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container">
          <div className="dashboard-hero-content">
            <div>
              <span className="dashboard-kicker">Student Administration</span>
              <h1>Student Management Dashboard</h1>
              <p>Manage student records, monitor enrollment, and quickly access academic information from one place.</p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/students" className="btn btn-light">View Students</Link>
                <Link to="/add-student" className="btn btn-outline-light">+ Add Student</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container dashboard-content">
        {error && <div className="alert alert-warning">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-stat-card"><span>Total Students</span><strong>{loading ? '—' : stats.totalStudents}</strong><small>All student records</small></div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-stat-card"><span>Active Students</span><strong>{loading ? '—' : activeStudents}</strong><small>Currently active</small></div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-stat-card"><span>Inactive Students</span><strong>{loading ? '—' : inactiveStudents}</strong><small>Not currently active</small></div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-stat-card"><span>Departments</span><strong>{loading ? '—' : departmentCount}</strong><small>Departments represented</small></div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="dashboard-panel h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div><h3>Enrollment Overview</h3><p>Student distribution from the enrollment data.</p></div>
                <Link to="/Enroll" className="btn btn-sm btn-outline-primary">View details</Link>
              </div>
              {stats.departmentStats.length ? (
                <div className="dashboard-list">
                  {stats.departmentStats.map((item) => {
                    const percentage = stats.totalStudents ? Math.round((item.count / stats.totalStudents) * 100) : 0;
                    return (
                      <div className="dashboard-list-item" key={item._id}>
                        <div className="d-flex justify-content-between"><strong>{item._id || 'Unknown'}</strong><span>{item.count} ({percentage}%)</span></div>
                        <div className="progress mt-2" role="progressbar" aria-label={`${item._id} enrollment`} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
                          <div className="progress-bar" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-muted mb-0">No enrollment data available yet.</p>}
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="dashboard-panel h-100">
              <h3>Quick Actions</h3>
              <p>Common tasks you can access immediately.</p>
              <div className="quick-actions">
                <Link to="/add-student" className="quick-action">Add a new student <span>→</span></Link>
                <Link to="/students" className="quick-action">Search and filter students <span>→</span></Link>
                <Link to="/Enroll" className="quick-action">Track enrollment <span>→</span></Link>
              </div>
              <div className="dashboard-mini-summary mt-4">
                <span>Enrollment years</span>
                <strong>{loading ? '—' : yearCount}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-feature-grid mt-4">
          <div><h5>Student Records</h5><p>View, edit, search, filter, sort, and manage student information.</p></div>
          <div><h5>Student Profiles</h5><p>Open an individual record to review personal and academic details.</p></div>
          <div><h5>Responsive UI</h5><p>Use the management system comfortably on desktop, tablet, and mobile.</p></div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
