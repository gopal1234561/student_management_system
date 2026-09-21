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

  if (loading) return <div className="container mt-5">Loading enrollment data...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Track Enrollment</h2>
      <p className="text-center text-muted mb-4">Monitor student enrollment and view enrollment trends.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Total Students Enrolled: {enrollmentStats.totalStudents}</h4>
        </div>
        <div className="col-md-6">
          <h4>Enrollments by Department</h4>
          {enrollmentStats.totalStudents > 0 ? <Pie data={departmentData} /> : <p>No data available.</p>}
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <h4>Enrollments by Year</h4>
          {enrollmentStats.totalStudents > 0 ? <Pie data={yearData} /> : <p>No data available.</p>}
        </div>
      </div>
    </div>
  );
};

export default Enroll;
