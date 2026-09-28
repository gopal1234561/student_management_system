import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getAllStudents, getCourseEnrollmentStats, getCourses } from '../api/studentAPI';
import './Enroll.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const normalizeDepartment = (value) => {
  const department = String(value || 'Unknown').trim();
  if (!department) return 'Unknown';
  const names = { cse: 'CSE', ece: 'ECE', it: 'IT', aiml: 'AIML', cs: 'CS', mech: 'MECH', civil: 'CIVIL' };
  return names[department.toLowerCase()] || department.toUpperCase();
};

const buildStudentData = (students) => {
  const departments = {};
  const years = {};
  students.forEach((student) => {
    const department = normalizeDepartment(student.department);
    const year = student.enrollmentYear || 'Unknown';
    departments[department] = (departments[department] || 0) + 1;
    years[year] = (years[year] || 0) + 1;
  });
  return {
    totalStudents: students.length,
    activeStudents: students.filter((student) => Boolean(student.isActive)).length,
    departments: Object.entries(departments).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    years: Object.entries(years).map(([year, count]) => ({ year, count })).sort((a, b) => Number(a.year) - Number(b.year)),
  };
};

const Enroll = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseStats, setCourseStats] = useState({ totalEnrollments: 0, statusStats: [], departmentStats: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError('');
      const [studentData, courseData, statsData] = await Promise.all([getAllStudents(), getCourses(), getCourseEnrollmentStats()]);
      setStudents(Array.isArray(studentData) ? studentData : []);
      setCourses(Array.isArray(courseData) ? courseData : []);
      setCourseStats(statsData || { totalEnrollments: 0, statusStats: [], departmentStats: [] });
    } catch (err) {
      console.error('Enrollment analytics loading error:', err);
      setError(err.response?.data?.error || 'Unable to load enrollment analytics. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const studentData = useMemo(() => buildStudentData(students), [students]);
  const activeRate = studentData.totalStudents ? Math.round((studentData.activeStudents / studentData.totalStudents) * 100) : 0;
  const totalCredits = courses.reduce((sum, course) => sum + Number(course.credits || 0), 0);

  const departmentChart = {
    labels: studentData.departments.map((item) => item.name),
    datasets: [{ data: studentData.departments.map((item) => item.count), backgroundColor: ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444'], borderColor: '#fff', borderWidth: 3 }]
  };
  const yearChart = {
    labels: studentData.years.map((item) => String(item.year)),
    datasets: [{ label: 'Students', data: studentData.years.map((item) => item.count), backgroundColor: '#6366f1', borderRadius: 10, borderSkipped: false }]
  };
  const statusChart = {
    labels: courseStats.statusStats.map((item) => item._id),
    datasets: [{ data: courseStats.statusStats.map((item) => item.count), backgroundColor: courseStats.statusStats.map((item) => ({ Enrolled: '#2563eb', Completed: '#16a34a', Dropped: '#dc2626' }[item._id] || '#64748b')), borderColor: '#fff', borderWidth: 3 }]
  };
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } } };
  const barOptions = { ...chartOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } } };

  return (
    <main className="container enrollment-page">
      <header className="enrollment-hero">
        <div><span className="enrollment-eyebrow">ACADEMIC ANALYTICS</span><h2>Track Enrollment</h2><p>Analytics only. Registration and history are handled in their dedicated pages.</p></div>
        <button type="button" className="enrollment-refresh" onClick={fetchAll} disabled={loading}>{loading ? 'Loading…' : '↻ Refresh'}</button>
      </header>
      <section className="enrollment-action-bar">
        <div><strong>Enrollment workflow</strong><span>Students → Courses → Course Enrollment → History → Analytics</span></div>
        <div className="enrollment-action-links"><Link to="/courses" className="btn btn-outline-primary">Courses</Link><Link to="/course-enrollment" className="btn btn-primary">Enroll Student</Link><Link to="/enrollment-history" className="btn btn-outline-secondary">History</Link></div>
      </section>
      {error && <div className="alert alert-warning">{error}</div>}
      <section className="enrollment-summary-grid">
        <div className="enrollment-summary"><div className="summary-icon">👥</div><div><span>Total students</span><strong>{loading ? '—' : studentData.totalStudents}</strong><small>From Student Management</small></div></div>
        <div className="enrollment-summary"><div className="summary-icon active-icon">✓</div><div><span>Active students</span><strong>{loading ? '—' : studentData.activeStudents}</strong><small>{activeRate}% active rate</small></div></div>
        <div className="enrollment-summary"><div className="summary-icon course-icon">📚</div><div><span>Course enrollments</span><strong>{loading ? '—' : courseStats.totalEnrollments}</strong><small>{courses.length} courses · {totalCredits} credits</small></div></div>
      </section>
      <section className="enrollment-charts">
        <article className="enrollment-chart-card"><div className="chart-heading"><div><span className="chart-kicker">STUDENT DISTRIBUTION</span><h4>Students by Department</h4></div><span className="chart-badge">{studentData.departments.length} groups</span></div><div className="enrollment-chart">{studentData.departments.length ? <Doughnut data={departmentChart} options={chartOptions} /> : <p className="enrollment-empty">No department data available.</p>}</div></article>
        <article className="enrollment-chart-card"><div className="chart-heading"><div><span className="chart-kicker">STUDENT INTAKE</span><h4>Students by Academic Year</h4></div><span className="chart-badge">{studentData.years.length} years</span></div><div className="enrollment-chart">{studentData.years.length ? <Bar data={yearChart} options={barOptions} /> : <p className="enrollment-empty">No academic-year data available.</p>}</div></article>
        <article className="enrollment-chart-card status-card"><div className="chart-heading"><div><span className="chart-kicker">COURSE RECORDS</span><h4>Enrollment Status</h4></div><span className="chart-badge">{courseStats.totalEnrollments} records</span></div><div className="enrollment-chart">{courseStats.statusStats.length ? <Doughnut data={statusChart} options={chartOptions} /> : <p className="enrollment-empty">No course enrollments yet.</p>}</div></article>
        <article className="enrollment-breakdown-card insights-card"><div className="chart-heading"><div><span className="chart-kicker">AT A GLANCE</span><h4>Overview</h4></div></div><div className="insight-list">
          <div><span>Largest department</span><strong>{studentData.departments[0]?.name || '—'} {studentData.departments[0] ? '(' + studentData.departments[0].count + ')' : ''}</strong></div>
          <div><span>Active student rate</span><strong>{activeRate}%</strong></div>
          <div><span>Academic years</span><strong>{studentData.years.length}</strong></div>
          <div><span>Available courses</span><strong>{courses.length}</strong></div>
          <div><span>Total credits available</span><strong>{totalCredits}</strong></div>
        </div></article>
      </section>
      <section className="enrollment-breakdown-grid">
        <article className="enrollment-breakdown-card"><div className="chart-heading"><div><span className="chart-kicker">STUDENT POPULATION</span><h4>Students by Department</h4></div></div>
          {studentData.departments.map((item) => <div className="breakdown-row" key={item.name}><span>{item.name}</span><div className="breakdown-bar"><i style={{ width: (studentData.totalStudents ? (item.count / studentData.totalStudents) * 100 : 0) + '%' }} /></div><strong>{item.count}</strong></div>)}
        </article>
        <article className="enrollment-breakdown-card"><div className="chart-heading"><div><span className="chart-kicker">ACTUAL REGISTRATIONS</span><h4>Course Enrollments by Department</h4></div></div>
          {courseStats.departmentStats.length ? courseStats.departmentStats.map((item) => <div className="breakdown-row" key={item._id}><span>{normalizeDepartment(item._id)}</span><div className="breakdown-bar enrollment-bar"><i style={{ width: (courseStats.totalEnrollments ? (item.count / courseStats.totalEnrollments) * 100 : 0) + '%' }} /></div><strong>{item.count}</strong></div>) : <p className="enrollment-empty compact-empty">No course registrations yet.</p>}
        </article>
      </section>
    </main>
  );
};

export default Enroll;
