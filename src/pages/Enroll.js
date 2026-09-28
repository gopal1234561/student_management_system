import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getEnrollmentStats } from '../api/studentAPI';
import './Enroll.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Enroll = () => {
  const [enrollmentStats, setEnrollmentStats] = useState({
    totalStudents: 0, departmentStats: [], yearStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getEnrollmentStats();
        setEnrollmentStats({
          totalStudents: data.totalStudents || 0,
          departmentStats: data.departmentStats || [],
          yearStats: data.yearStats || [],
        });
      } catch (err) {
        setError('Failed to fetch enrollment stats. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const departmentData = {
    labels: enrollmentStats.departmentStats.map(item => item._id),
    datasets: [{ data: enrollmentStats.departmentStats.map(item => item.count) }],
  };

  const yearData = {
    labels: enrollmentStats.yearStats.map(item => item._id),
    datasets: [{ data: enrollmentStats.yearStats.map(item => item.count) }],
  };

  if (loading) return <main className="container enrollment-page">Loading enrollment data...</main>;

  return (
    <div className="container mt-5">
      <header className="enrollment-hero">
        <div><span className="enrollment-eyebrow">STUDENT ANALYTICS</span><h2>Track Enrollment</h2><p>Monitor student enrollment and explore department and academic-year trends.</p></div>
        <div className="enrollment-hero-icon" aria-hidden="true">↗</div>
      </header>
      {error && <div className="alert alert-danger">{error}</div>}
      <section className="enrollment-summary"><div className="summary-icon">👥</div><div><span>Total students enrolled</span><strong>{enrollmentStats.totalStudents}</strong><small>Across all departments and years</small></div></section>
      <section className="enrollment-charts">
        <article className="enrollment-chart-card"><div className="chart-heading"><div><span className="chart-kicker">DISTRIBUTION</span><h4>By Department</h4></div><span className="chart-badge">Departments</span></div><div className="enrollment-chart">{enrollmentStats.totalStudents > 0 && enrollmentStats.departmentStats.length > 0 ? <Pie data={departmentData} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 18 } } } }} /> : <p className="enrollment-empty">No department data available yet.</p>}</div></article>
        <article className="enrollment-chart-card"><div className="chart-heading"><div><span className="chart-kicker">YEARLY OVERVIEW</span><h4>By Academic Year</h4></div><span className="chart-badge">Year groups</span></div><div className="enrollment-chart">{enrollmentStats.totalStudents > 0 && enrollmentStats.yearStats.length > 0 ? <Pie data={yearData} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 18 } } } }} /> : <p className="enrollment-empty">No academic-year data available yet.</p>}</div></article>
      </section>
    </main>
  );
};

export default Enroll;
