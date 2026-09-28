import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import Enroll from './pages/Enroll';
import StudentDetails from './pages/StudentDetails';
import CourseList from './pages/CourseList';
import CourseEnrollment from './pages/CourseEnrollment';
import EnrollmentHistory from './pages/EnrollmentHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from './Footer';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Router>
      <div className="app">
        <nav className="navbar navbar-expand-lg navbar-dark bg-strong-purple">
          <div className="container">
            <Link className="navbar-brand product-brand" to="/" onClick={closeMenu}>
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 36 36" role="img">
                  <rect x="3" y="3" width="30" height="30" rx="9" fill="currentColor" opacity=".14"/>
                  <path d="M9 12.5 18 8l9 4.5-9 4.5-9-4.5Zm3 4.3v6.2c3.7 2.1 8.3 2.1 12 0v-6.2L18 20l-6-3.2Z" fill="currentColor"/>
                  <path d="M27 14.5v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span>Student Management</span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              aria-controls="navbarNav"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse${isMenuOpen ? ' show' : ''}`} id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><NavLink end className="nav-link" to="/" onClick={closeMenu}>Dashboard</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/students" onClick={closeMenu}>Students</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/add-student" onClick={closeMenu}>Add Student</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/Enroll" onClick={closeMenu}>Track Enrollment</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/courses" onClick={closeMenu}>Courses</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/course-enrollment" onClick={closeMenu}>Enroll Student</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/enrollment-history" onClick={closeMenu}>History</NavLink></li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/edit-student/:id" element={<EditStudent />} />
          <Route path="/Enroll" element={<Enroll />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course-enrollment" element={<CourseEnrollment />} />
          <Route path="/enrollment-history" element={<EnrollmentHistory />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
