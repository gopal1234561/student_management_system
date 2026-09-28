import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllStudents, deleteStudent } from '../api/studentAPI';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchStudents = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await getAllStudents();
      if (!Array.isArray(data)) throw new Error('Unexpected response from the server.');
      setStudents(data);
      const query = searchQuery.trim().toLowerCase();
      setFilteredStudents(query ? data.filter((stu) => {
        const values = [stu.firstName, stu.lastName, stu.studentId, stu.enrollmentYear]
          .map((value) => String(value ?? '').toLowerCase());
        return values.some((value) => value.includes(query));
      }) : data);
    } catch (error) {
      console.error('Unable to load students:', error);
      setLoadError('Unable to load students. Please check your connection and try again.');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchClick = () => {
    const query = searchQuery.trim().toLowerCase();
    setFilteredStudents(students.filter((stu) => {
      const values = [stu.firstName, stu.lastName, stu.studentId, stu.enrollmentYear]
        .map((value) => String(value ?? '').toLowerCase());
      return values.some((value) => value.includes(query));
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted');
      await fetchStudents();
    } catch (error) {
      console.error('Unable to delete student:', error);
      toast.error('Failed to delete student');
    }
  };

  return (
    <div className="container mt-4 student-list-page">
      <h2 className="mb-4">Student List</h2>
      <div className="student-list-controls mb-4">
        <input
          type="text"
          className="form-control student-search-input"
          placeholder="Search by Name, ID, or Year"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearchClick(); }}
          aria-label="Search students by name, ID, or year"
        />
        <button className="btn btn-primary" onClick={handleSearchClick} disabled={isLoading}>Search</button>
        <button className="btn btn-outline-secondary" onClick={fetchStudents} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {isLoading ? (
        <p role="status">Loading students...</p>
      ) : loadError ? (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{loadError}</p>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchStudents}>Try again</button>
        </div>
      ) : filteredStudents.length === 0 ? (
        <p>{students.length === 0 ? 'No students have been added yet.' : 'No students match your search.'}</p>
      ) : (
        <div className="table-responsive student-table-wrapper">
          <table className="table table-striped table-hover shadow-sm rounded align-middle">
            <thead className="table-dark">
              <tr>
                <th>Student ID</th><th>Name</th><th>Email</th><th>DOB</th>
                <th>Department</th><th>Year</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stu) => (
                <tr key={stu._id}>
                  <td>{stu.studentId || 'N/A'}</td>
                  <td>{stu.firstName} {stu.lastName}</td>
                  <td>{stu.email}</td>
                  <td>{stu.dob?.slice(0, 10)}</td>
                  <td>{stu.department}</td>
                  <td>{stu.enrollmentYear}</td>
                  <td>{stu.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="student-actions">
                    <Link to={`/edit-student/${stu._id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                    <button onClick={() => handleDelete(stu._id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
