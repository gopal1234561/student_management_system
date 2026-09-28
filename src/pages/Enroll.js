import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import {
  getAllStudents, getCourseEnrollmentStats, getCourses,
} from '../api/studentAPI';
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
    inactiveStudents: students.filter((student) => !student.isActive).length,
    departments: Object.entries(departments).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    years: Object.entries(years).map(([year, count]) => ({ year, count })).sort((a, b) => Number(a.year) - Number(b.year)),
  };
};

const emptyCourse = { courseCode: '', courseName: '', department: '', credits: 3, semester: 'Semester 1' };
const emptyEnrollment = { student: '', course: '', academicYear: new Date().getFullYear(), semester: 'Semester 1', status: 'Enrolled' };

const Enroll = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [courseStats, setCourseStats] = useState({ totalEnrollments: 0, statusStats: [], departmentStats: [], semesterStats: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError('');
      const [studentData, courseData, enrollmentData, statsData] = await Promise.all([
        getAllStudents(), getCourses(), getEnrollments(), getCourseEnrollmentStats(),
      ]);
      setStudents(Array.isArray(studentData) ? studentData : []);
      setCourses(Array.isArray(courseData) ? courseData : []);
      setEnrollments(Array.isArray(enrollmentData) ? enrollmentData : []);
      setCourseStats(statsData || { totalEnrollments: 0, statusStats: [], departmentStats: [], semesterStats: [] });
    } catch (err) {
      console.error('Enrollment management loading error:', err);
      setError(err.response?.data?.error || 'Unable to load enrollment management data. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const studentData = useMemo(() => buildStudentData(students), [students]);
  const activeRate = studentData.totalStudents ? Math.round((studentData.activeStudents / studentData.totalStudents) * 100) : 0;
  const latestYear = studentData.years.length ? studentData.years[studentData.years.length - 1].year : '—';

  const departmentChart = {
    labels: studentData.departments.map((item) => item.name),
    datasets: [{ data: studentData.departments.map((item) => item.count), backgroundColor: ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444', '#22c55e'], hoverBackgroundColor: ['#4f46e5', '#0f766e', '#d97706', '#db2777', '#0891b2', '#7c3aed', '#dc2626', '#16a34a'], borderColor: '#fff', borderWidth: 3 }],
  };
  const yearChart = {
    labels: studentData.years.map((item) => String(item.year)),
    datasets: [{ label: 'Students', data: studentData.years.map((item) => item.count), backgroundColor: '#6366f1', hoverBackgroundColor: '#4338ca', borderRadius: 10, borderSkipped: false }],
  };
  const statusChart = {
    labels: courseStats.statusStats.map((item) => item._id),
    datasets: [{ data: courseStats.statusStats.map((item) => item.count), backgroundColor: courseStats.statusStats.map((item) => ({ Enrolled: '#2563eb', Completed: '#16a34a', Dropped: '#dc2626' }[item._id] || '#64748b')), borderColor: '#fff', borderWidth: 3 }],
  };
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } } };
  const barOptions = { ...chartOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } } };

  const filteredHistory = useMemo(() => {
    const query = historyFilter.trim().toLowerCase();
    if (!query) return enrollments;
    return enrollments.filter((item) => [item.student?.studentId, item.student?.firstName, item.student?.lastName, item.course?.courseCode, item.course?.courseName, item.status, item.semester, item.academicYear].join(' ').toLowerCase().includes(query));
  }, [enrollments, historyFilter]);

  return (
    <main className="container enrollment-page">
      <header className="enrollment-hero">
        <div>
          <span className="enrollment-eyebrow">ACADEMIC ADMINISTRATION</span>
          <h2>Track Enrollment</h2>
          <p>Analyze students and manage courses, semester enrollments, credits and enrollment history from one place.</p>
        </div>
        <button type="button" className="enrollment-refresh" onClick={fetchAll} disabled={loading}>{loading ? 'Loading…' : '↻ Refresh'}</button>
      </header>

      {error && <div className="alert alert-warning">{error}</div>}
      <div className="enrollment-action-bar"><div><strong>Enrollment Analytics</strong><span>Live overview from students, courses and enrollment records.</span></div><div className="enrollment-action-links"><Link to="/courses" className="btn btn-outline-primary">Manage Courses</Link><Link to="/course-enrollment" className="btn btn-primary">Enroll Student</Link><Link to="/enrollment-history" className="btn btn-outline-secondary">View History</Link></div></div>

          <section className="enrollment-summary-grid">
            <div className="enrollment-summary"><div className="summary-icon">👥</div><div><span>Total students</span><strong>{loading ? '—' : studentData.totalStudents}</strong><small>All student records</small></div></div>
            <div className="enrollment-summary"><div className="summary-icon active-icon">✓</div><div><span>Active students</span><strong>{loading ? '—' : studentData.activeStudents}</strong><small>{activeRate}% active rate</small></div></div>
            <div className="enrollment-summary"><div className="summary-icon course-icon">📚</div><div><span>Course enrollments</span><strong>{loading ? '—' : courseStats.totalEnrollments}</strong><small>{courses.length} courses available</small></div></div>
          </section>

          <section className="enrollment-charts">
            <article className="enrollment-chart-card"><div className="chart-heading"><div><span className="chart-kicker">STUDENT DISTRIBUTION</span><h4>By Department</h4></div><span className="chart-badge">{studentData.departments.length} groups</span></div><div className="enrollment-chart">{studentData.departments.length ? <Doughnut data={departmentChart} options={chartOptions} /> : <p className="enrollment-empty">No department data available.</p>}</div></article>
            <article className="enrollment-chart-card"><div className="chart-heading"><div><span className="chart-kicker">YEARLY OVERVIEW</span><h4>By Academic Year</h4></div><span className="chart-badge">{studentData.years.length} years</span></div><div className="enrollment-chart">{studentData.years.length ? <Bar data={yearChart} options={barOptions} /> : <p className="enrollment-empty">No academic-year data available.</p>}</div></article>
            <article className="enrollment-chart-card status-card"><div className="chart-heading"><div><span className="chart-kicker">COURSE STATUS</span><h4>Enrollment Status</h4></div><span className="chart-badge">{courseStats.totalEnrollments} records</span></div><div className="enrollment-chart">{courseStats.statusStats.length ? <Doughnut data={statusChart} options={chartOptions} /> : <p className="enrollment-empty">No course enrollments yet.</p>}</div></article>
            <article className="enrollment-breakdown-card insights-card"><div className="chart-heading"><div><span className="chart-kicker">QUICK INSIGHTS</span><h4>Enrollment Overview</h4></div></div><div className="insight-list">
              <div><span>Largest department</span><strong>{studentData.departments[0]?.name || '—'} <small>{studentData.departments[0] ? `(${studentData.departments[0].count})` : ''}</small></strong></div>
              <div><span>Active student rate</span><strong>{activeRate}%</strong></div>
              <div><span>Latest student year</span><strong>{latestYear}</strong></div>
              <div><span>Available courses</span><strong>{courses.length}</strong></div>
              <div><span>Total credits available</span><strong>{courses.reduce((sum, course) => sum + Number(course.credits || 0), 0)}</strong></div>
            </div></article>
          </section>

          <section className="enrollment-breakdown-grid">
            <article className="enrollment-breakdown-card"><div className="chart-heading"><div><span className="chart-kicker">DEPARTMENT BREAKDOWN</span><h4>Students by Department</h4></div></div>
              {studentData.departments.map((item) => <div className="breakdown-row" key={item.name}><span>{item.name}</span><div className="breakdown-bar"><i style={{ width: `${studentData.totalStudents ? (item.count / studentData.totalStudents) * 100 : 0}%` }} /></div><strong>{item.count}</strong></div>)}
            </article>
            <article className="enrollment-breakdown-card"><div className="chart-heading"><div><span className="chart-kicker">COURSE ENROLLMENT</span><h4>Department-wise Enrollments</h4></div></div>
              {courseStats.departmentStats.length ? courseStats.departmentStats.map((item) => <div className="breakdown-row" key={item._id}><span>{normalizeDepartment(item._id)}</span><div className="breakdown-bar enrollment-bar"><i style={{ width: `${courseStats.totalEnrollments ? (item.count / courseStats.totalEnrollments) * 100 : 0}%` }} /></div><strong>{item.count}</strong></div>) : <p className="enrollment-empty compact-empty">No course enrollment data yet.</p>}
            </article>
          </section>
    </main>
  );
};

export default Enroll;
