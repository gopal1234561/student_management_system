import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import Enroll from './pages/Enroll';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from './Footer';

const App = () => (
  <Router>
    <div className="app">
      <nav className="navbar navbar-expand-lg navbar-dark bg-strong-purple">
        <div className="container">
          <Link className="navbar-brand" to="/">Student Management</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/students">Student List</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/add-student">Add Student</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/Enroll">Track Enrollment</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/edit-student/:id" element={<EditStudent />} />
        <Route path="/Enroll" element={<Enroll />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </div>
  </Router>
);

export default App;
