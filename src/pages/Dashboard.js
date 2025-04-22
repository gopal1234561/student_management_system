import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
const Dashboard = () => {
  return (
    <div>
      <div className="container-fluid bg-primary text-white p-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-12 col-md-6 text-center text-md-left">
              <h1 className="display-4">Welcome to the Student Management System</h1>
              <p className="lead">Effortlessly manage student records with ease. Keep track of student data, enrollments, and more.</p>
              <div className="d-flex justify-content-center justify-content-md-start">
                <Link to="/students" className="btn btn-light btn-lg mr-3"><i class="fas fa-list"></i> View Student List</Link>
                <Link to="/add-student" className="btn btn-light btn-lg"><i class="fas fa-plus-circle"></i>Add New Student</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-5">
        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title"><i class="fas fa-user-cog me-2"></i> Manage Students</h5>
                <p className="card-text">Easily add, edit, or delete student records. All changes are reflected immediately.</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title"><i class="fas fa-chart-line me-2"></i> Track Enrollment</h5>
                <p className="card-text">Monitor student enrollment, track academic progress, and more.</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title"><i class="fas fa-file-alt me-2"></i> Generate Reports</h5>
                <p className="card-text">Generate and export student reports as needed. Analyze data with ease.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
