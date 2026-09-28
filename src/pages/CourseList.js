import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createCourse, deleteCourse, getCourses } from '../api/studentAPI';
import './Enroll.css';

const emptyCourse = { courseCode: '', courseName: '', department: '', credits: 3, semester: 'Semester 1' };
const departments = ['CSE', 'ECE', 'IT', 'AIML', 'MECH', 'CS', 'CIVIL'];

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyCourse);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to load courses');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await createCourse({ ...form, credits: Number(form.credits) });
      toast.success('Course added successfully');
      setForm(emptyCourse);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add course');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this course? Courses with enrollment history cannot be deleted.')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete course');
    }
  };

  return (
    <main className="container enrollment-page">
      <header className="enrollment-hero">
        <div><span className="enrollment-eyebrow">ACADEMIC ADMINISTRATION</span><h2>Course Management</h2><p>Create and maintain the course catalog used by student enrollments.</p></div>
        <div className="enrollment-hero-actions"><Link to="/Enroll" className="enrollment-hero-link">← Analytics</Link><Link to="/course-enrollment" className="enrollment-hero-link primary">+ Enroll Student</Link></div>
      </header>
      <section className="management-grid">
        <article className="management-card">
          <div className="chart-heading"><div><span className="chart-kicker">COURSE CATALOG</span><h4>Add Course</h4></div></div>
          <form className="management-form" onSubmit={submit}>
            <label>Course code<input required className="form-control" placeholder="e.g. CS301" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value.toUpperCase() })} /></label>
            <label>Course name<input required className="form-control" placeholder="Course name" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} /></label>
            <label>Department<select required className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}><option value="">Select department</option>{departments.map((d) => <option key={d}>{d}</option>)}</select></label>
            <div className="form-row"><label>Credits<input required min="1" max="10" type="number" className="form-control" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} /></label><label>Semester<select className="form-select" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>{Array.from({ length: 8 }, (_, i) => <option key={i}>Semester {i + 1}</option>)}</select></label></div>
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : '+ Add Course'}</button>
          </form>
        </article>
        <article className="management-card course-list-card">
          <div className="chart-heading"><div><span className="chart-kicker">COURSE CATALOG</span><h4>{courses.length} Courses</h4></div><button type="button" className="btn btn-sm btn-outline-secondary" onClick={load}>Refresh</button></div>
          {loading ? <div className="enrollment-empty course-empty">Loading courses...</div> : courses.length ? <div className="course-list">{courses.map((course) => <div className="course-row" key={course._id}><div><strong>{course.courseCode}</strong><span>{course.courseName}</span><small>{course.department || 'Department not set'} · {course.semester || 'Semester not set'}</small></div><div className="course-meta"><b>{course.credits}</b><small>credits</small><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(course._id)}>Delete</button></div></div>)}</div> : <div className="enrollment-empty course-empty">No courses yet. Add your first course.</div>}
        </article>
      </section>
    </main>
  );
}