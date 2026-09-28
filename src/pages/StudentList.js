import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteStudent, getAllStudents } from '../api/studentAPI';

const PAGE_SIZE = 8;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchStudents = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await getAllStudents();
      if (!Array.isArray(data)) throw new Error('Unexpected response from the server.');
      setStudents(data);
    } catch (error) {
      console.error('Unable to load students:', error);
      setLoadError('Unable to load students. Please check your connection and try again.');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, department, year, status, sortBy, sortOrder]);

  const departments = useMemo(
    () => [...new Set(students.map((s) => s.department).filter(Boolean))].sort(),
    [students]
  );
  const years = useMemo(
    () => [...new Set(students.map((s) => s.enrollmentYear).filter(Boolean))].sort((a, b) => Number(a) - Number(b)),
    [students]
  );

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = students.filter((stu) => {
      const searchable = [stu.firstName, stu.lastName, stu.studentId, stu.email, stu.department, stu.enrollmentYear]
        .map((value) => String(value ?? '').toLowerCase());
      const matchesSearch = !query || searchable.some((value) => value.includes(query));
      const matchesDepartment = !department || String(stu.department) === department;
      const matchesYear = !year || String(stu.enrollmentYear) === String(year);
      const matchesStatus = !status || (status === 'active' ? stu.isActive : !stu.isActive);
      return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
    });

    result.sort((a, b) => {
      let left;
      let right;
      if (sortBy === 'year') {
        left = Number(a.enrollmentYear) || 0;
        right = Number(b.enrollmentYear) || 0;
      } else if (sortBy === 'department') {
        left = String(a.department || '').toLowerCase();
        right = String(b.department || '').toLowerCase();
      } else {
        left = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
        right = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
      }
      const comparison = left > right ? 1 : left < right ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [students, searchQuery, department, year, status, sortBy, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const currentStudents = filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearchQuery('');
    setDepartment('');
    setYear('');
    setStatus('');
    setSortBy('name');
    setSortOrder('asc');
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
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Student List</h2>
          <p className="text-muted mb-0">{filteredStudents.length} student{filteredStudents.length === 1 ? '' : 's'} found</p>
        </div>
        <Link to="/add-student" className="btn btn-success">+ Add Student</Link>
      </div>

      <div className="student-filters card shadow-sm p-3 mb-4">
        <div className="student-list-controls">
          <input
            type="text"
            className="form-control student-search-input"
            placeholder="Search name, ID, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search students"
          />
          <select className="form-select student-filter-select" value={department} onChange={(e) => setDepartment(e.target.value)} aria-label="Filter by department">
            <option value="">All departments</option>
            {departments.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="form-select student-filter-select" value={year} onChange={(e) => setYear(e.target.value)} aria-label="Filter by enrollment year">
            <option value="">All years</option>
            {years.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="form-select student-filter-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="form-select student-filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort students">
            <option value="name">Sort: Name</option>
            <option value="department">Sort: Department</option>
            <option value="year">Sort: Year</option>
          </select>
          <button className="btn btn-outline-secondary" onClick={() => setSortOrder((value) => value === 'asc' ? 'desc' : 'asc')} aria-label="Toggle sort order">
            {sortOrder === 'asc' ? 'A-Z ↑' : 'Z-A ↓'}
          </button>
          <button className="btn btn-outline-secondary" onClick={clearFilters}>Clear</button>
          <button className="btn btn-outline-primary" onClick={fetchStudents} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5" role="status">Loading students...</div>
      ) : loadError ? (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{loadError}</p>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchStudents}>Try again</button>
        </div>
      ) : currentStudents.length === 0 ? (
        <div className="text-center py-5 card shadow-sm">
          <h5>No students found</h5>
          <p className="text-muted mb-3">Try changing your search or filters.</p>
          <button className="btn btn-outline-primary" onClick={clearFilters}>Clear filters</button>
        </div>
      ) : (
        <>
          <div className="table-responsive student-table-wrapper">
            <table className="table table-striped table-hover shadow-sm rounded align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Student ID</th><th>Name</th><th>Email</th><th>DOB</th>
                  <th>Department</th><th>Year</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((stu) => (
                  <tr key={stu._id}>
                    <td>{stu.studentId || 'N/A'}</td>
                    <td>{stu.firstName} {stu.lastName}</td>
                    <td>{stu.email}</td>
                    <td>{stu.dob ? String(stu.dob).slice(0, 10) : 'N/A'}</td>
                    <td>{stu.department || 'N/A'}</td>
                    <td>{stu.enrollmentYear || 'N/A'}</td>
                    <td><span className={`badge ${stu.isActive ? 'bg-success' : 'bg-secondary'}`}>{stu.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="student-actions">
                      <Link to={`/students/${stu._id}`} className="btn btn-sm btn-info me-2">View</Link>
                      <Link to={`/edit-student/${stu._id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                      <button onClick={() => handleDelete(stu._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
            <span className="text-muted">Page {page} of {pageCount}</span>
            <div className="btn-group" role="group" aria-label="Student list pagination">
              <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <button className="btn btn-outline-primary" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;
