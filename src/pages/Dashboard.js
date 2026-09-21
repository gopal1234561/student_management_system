import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Dashboard = () => (
  <div>
    <div className="container-fluid bg-primary text-white p-5">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-12 col-md-8 text-center">
            <h1 className="display-4">Welcome to the Student Management System</h1>
            <p className="lead">Effortlessly manage student records, enrollment data, and student status from one place.</p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/students" className="btn btn-light btn-lg">View Student List</Link>
              <Link to="/add-student" className="btn btn-light btn-lg">Add New Student</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="container my-5">
      <div className="row">
        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-sm h-100"><div className="card-body">
            <h5 className="card-title">Manage Students</h5>
            <p className="card-text">Add, edit, search, and delete student records.</p>
          </div></div>
        </div>
        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-sm h-100"><div className="card-body">
            <h5 className="card-title">Track Enrollment</h5>
            <p className="card-text">View enrollment distribution by department and year.</p>
          </div></div>
        </div>
        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-sm h-100"><div className="card-body">
            <h5 className="card-title">Student Records</h5>
            <p className="card-text">Keep student information organized and easy to maintain.</p>
          </div></div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
