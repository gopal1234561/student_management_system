import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getAllStudents } from '../api/studentAPI';
import './Enroll.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const normalizeDepartment = (value) => {
  const department = String(value || 'Unknown').trim();
  if (!department) return 'Unknown';
  const names = { cse: 'CSE', ece: 'ECE', it: 'IT', aiml: 'AIML', cs: 'CS', mech: 'MECH', civil: 'CIVIL' };
  return names[department.toLowerCase()] || department.toUpperCase();
};

const buildEnrollmentData = (students) => {
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
    departments: Object.entries(departments)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    years: Object.entries(years)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => Number(a.year) - Number(b.year)),
  };
};

const Enroll = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEnrollment = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllStudents();
      if (!Array.isArray(data)) throw new Error('Unexpected student API response.');
      setStudents(data);
    } catch (err) {
      console.error('Enrollment loading error:', err);
      setStudents([]);
      setError('Unable to load enrollment data. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, []);

  const enrollment = useMemo(() => buildEnrollmentData(students), [students]);

  const departmentChart = {
    labels: enrollment.departments.map((item) => item.name),
    datasets: [{
      data: enrollment.departments.map((item) => item.count),
      backgroundColor: ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444', '#22c55e'],
      hoverBackgroundColor: ['#4f46e5', '#0f766e', '#d97706', '#db2777', '#0891b2', '#7c3aed', '#dc2626', '#16a34a'],
      borderColor: '#ffffff',
      borderWidth: 3,
    }],
  };

  const yearChart = {
    labels: enrollment.years.map((item) => String(item.year)),
    datasets: [{
      label: 'Students',
      data: enrollment.years.map((item) => item.count),
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return '#6366f1';
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#2dd4bf');
        return gradient;
      },
      borderRadius: 10,
      borderSkipped: false,
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } },
  };

  const barOptions = {
    ...chartOptions,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { grid: { display: false } },
    },
  };

  return (
    <main className="container enrollment-page">
      <header className="enrollment-hero">
        <div>
          <span className="enrollment-eyebrow">STUDENT ANALYTICS</span>
          <h2>Track Enrollment</h2>
          <p>Explore live student enrollment by department and academic year.</p>
        </div>
        <button type="button" className="enrollment-refresh" onClick={fetchEnrollment} disabled={loading}>
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </header>

      {error && <div className="alert alert-warning">{error}</div>}

      <section className="enrollment-summary-grid">
        <div className="enrollment-summary"><div className="summary-icon">👥</div><div><span>Total students</span><strong>{loading ? '—' : enrollment.totalStudents}</strong><small>All student records</small></div></div>
        <div className="enrollment-summary"><div className="summary-icon">✓</div><div><span>Active students</span><strong>{loading ? '—' : enrollment.activeStudents}</strong><small>Currently active</small></div></div>
        <div className="enrollment-summary"><div className="summary-icon">○</div><div><span>Inactive students</span><strong>{loading ? '—' : enrollment.inactiveStudents}</strong><small>Currently inactive</small></div></div>
      </section>

      <section className="enrollment-charts">
        <article className="enrollment-chart-card">
          <div className="chart-heading"><div><span className="chart-kicker">DISTRIBUTION</span><h4>By Department</h4></div><span className="chart-badge">{enrollment.departments.length} groups</span></div>
          <div className="enrollment-chart">
            {enrollment.departments.length ? <Doughnut data={departmentChart} options={chartOptions} /> : <p className="enrollment-empty">{loading ? 'Loading...' : 'No department data available.'}</p>}
          </div>
        </article>

        <article className="enrollment-chart-card">
          <div className="chart-heading"><div><span className="chart-kicker">YEARLY OVERVIEW</span><h4>By Academic Year</h4></div><span className="chart-badge">{enrollment.years.length} years</span></div>
          <div className="enrollment-chart">
            {enrollment.years.length ? <Bar data={yearChart} options={barOptions} /> : <p className="enrollment-empty">{loading ? 'Loading...' : 'No academic-year data available.'}</p>}
          </div>
        </article>
      </section>

      <section className="enrollment-breakdown-grid">
        <article className="enrollment-breakdown-card">
          <div className="chart-heading"><div><span className="chart-kicker">DEPARTMENT BREAKDOWN</span><h4>Students by Department</h4></div></div>
          {enrollment.departments.map((item) => (
            <div className="breakdown-row" key={item.name}>
              <span>{item.name}</span>
              <div className="breakdown-bar"><i style={{ width: `${enrollment.totalStudents ? (item.count / enrollment.totalStudents) * 100 : 0}%` }} /></div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </article>

        <article className="enrollment-breakdown-card">
          <div className="chart-heading"><div><span className="chart-kicker">YEAR BREAKDOWN</span><h4>Students by Enrollment Year</h4></div></div>
          {enrollment.years.map((item) => (
            <div className="breakdown-row" key={item.year}>
              <span>{item.year}</span>
              <div className="breakdown-bar"><i style={{ width: `${enrollment.totalStudents ? (item.count / enrollment.totalStudents) * 100 : 0}%` }} /></div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
};

export default Enroll;
