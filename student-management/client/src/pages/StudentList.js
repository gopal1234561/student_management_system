
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllStudents, deleteStudent } from '../api/studentAPI';
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const fetchStudents = async () => {
    try {
      setLoading(true); 
      const data = await getAllStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchStudents();
  }, []);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchClick = () => {
    const filteredData = students.filter((stu) => {
      return (
        stu.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.enrollmentYear.toString().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredStudents(filteredData); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        toast.success('Student deleted');
        fetchStudents(); 
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  return (
  
    <div className="container mt-4">
     
      <h2 className="mb-4">Student List</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control d-inline-block me-2"
          placeholder="Search by Name, ID, or Year"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ maxWidth: '300px' }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
      
      {loading ? (
  <p>Loading students...</p>
) : filteredStudents.length === 0 ? (
  <p>No students found.</p>
) : (
        <table className="table table-striped table-hover shadow-sm rounded">
          <thead className="table-dark">
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Department</th>
              <th>Year</th>
              <th>Status</th>
              <th>Actions</th>
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
                <td>
                  <Link to={`/edit-student/${stu._id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                  <button onClick={() => handleDelete(stu._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;
