import React, { useEffect, useState } from 'react';

import { Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; 
import { getEnrollmentStats } from '../api/studentAPI';  // Import the API function
import './Enroll.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Enroll = () => {
  const [enrollmentStats, setEnrollmentStats] = useState({
    totalStudents: 0,
    departmentStats: [],
    yearStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch enrollment stats from the backend using axios through getEnrollmentStats
  const fetchStats = async () => {
    try {
      const data = await getEnrollmentStats();  // Using the API function here
      setEnrollmentStats(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch enrollment stats. Please try again later.');
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats(); 
  }, []);

  const departmentData = {
    labels: enrollmentStats.departmentStats.map(item => item._id),
    datasets: [
      {
        data: enrollmentStats.departmentStats.map(item => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FFCD56'],
      },
    ],
  };

  const yearData = {
    labels: enrollmentStats.yearStats.map(item => item._id),
    datasets: [
      {
        data: enrollmentStats.yearStats.map(item => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FFCD56'],
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Track Enrollment</h2>
      <p className="text-center text-muted mb-4">
        Monitor student enrollment, track academic progress, and more.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Total Students Enrolled: {enrollmentStats.totalStudents}</h4>
        </div>
        <div className="col-md-6">
          <h4>Enrollments by Department</h4>
          {enrollmentStats.totalStudents > 0 ? (
            <Pie data={departmentData} />
          ) : (
            <p>No data available for the department pie chart.</p>
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <h4>Enrollments by Year</h4>
          {enrollmentStats.totalStudents > 0 ? (
            <Pie data={yearData} />
          ) : (
            <p>No data available for the year-wise pie chart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enroll;
