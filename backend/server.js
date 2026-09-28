const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true, trim: true },
  enrollmentYear: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
  courseName: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  credits: { type: Number, required: true, min: 1, max: 10 },
  semester: { type: String, required: true, trim: true }
}, { timestamps: true });

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  academicYear: { type: Number, required: true },
  semester: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Enrolled', 'Completed', 'Dropped'], default: 'Enrolled' },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
}, { timestamps: true });

enrollmentSchema.index({ student: 1, course: 1, academicYear: 1, semester: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

const validationMessage = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'record';
    return { status: 409, message: `A record with this ${field} already exists` };
  }
  if (error.name === 'ValidationError') {
    return { status: 400, message: Object.values(error.errors).map(e => e.message).join(', ') };
  }
  return { status: 500, message: 'Server error' };
};

app.get('/', (req, res) => {
  res.json({
    service: 'Student Management System API',
    status: mongoose.connection.readyState === 1 ? 'connected' : 'starting',
    endpoints: ['/health', '/students', '/stats', '/courses', '/enrollments']
  });
});

app.get('/health', (req, res) => {
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? 'ok' : 'database-not-connected'
  });
});

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: 'Invalid student ID' });
  }
});

app.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    const result = validationMessage(error);
    res.status(result.status).json({ error: result.message === 'Server error' ? 'Failed to add student' : result.message });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    const result = validationMessage(error);
    res.status(result.status === 500 ? 400 : result.status).json({ error: result.message === 'Server error' ? 'Failed to update student' : result.message });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    await Enrollment.deleteMany({ student: req.params.id });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid student ID' });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const [totalStudents, departmentStats, yearStats] = await Promise.all([
      Student.countDocuments(),
      Student.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Student.aggregate([{ $group: { _id: '$enrollmentYear', count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
    ]);
    res.json({ totalStudents, departmentStats, yearStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollment statistics' });
  }
});

app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ department: 1, courseCode: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/courses', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    const result = validationMessage(error);
    res.status(result.status).json({ error: result.message === 'Server error' ? 'Failed to add course' : result.message });
  }
});

app.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    const result = validationMessage(error);
    res.status(result.status === 500 ? 400 : result.status).json({ error: result.message === 'Server error' ? 'Failed to update course' : result.message });
  }
});

app.delete('/courses/:id', async (req, res) => {
  try {
    const linked = await Enrollment.countDocuments({ course: req.params.id });
    if (linked) return res.status(409).json({ error: 'Cannot delete a course with enrollment history. Remove its enrollments first.' });
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid course ID' });
  }
});

app.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'studentId firstName lastName department')
      .populate('course', 'courseCode courseName department credits')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

app.get('/enrollments/student/:studentId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId })
      .populate('course', 'courseCode courseName department credits')
      .sort({ academicYear: -1, createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(400).json({ error: 'Invalid student ID' });
  }
});

app.post('/enrollments', async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    const populated = await enrollment.populate([
      { path: 'student', select: 'studentId firstName lastName department' },
      { path: 'course', select: 'courseCode courseName department credits' }
    ]);
    res.status(201).json(populated);
  } catch (error) {
    const result = validationMessage(error);
    res.status(result.status).json({ error: result.message === 'Server error' ? 'Failed to create enrollment' : result.message });
  }
});

app.put('/enrollments/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('student', 'studentId firstName lastName department')
      .populate('course', 'courseCode courseName department credits');
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
    res.json(enrollment);
  } catch (error) {
    const result = validationMessage(error);
    res.status(result.status === 500 ? 400 : result.status).json({ error: result.message === 'Server error' ? 'Failed to update enrollment' : result.message });
  }
});

app.delete('/enrollments/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid enrollment ID' });
  }
});

app.get('/enrollment-stats', async (req, res) => {
  try {
    const [statusStats, departmentStats, semesterStats] = await Promise.all([
      Enrollment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Enrollment.aggregate([
        { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'student' } },
        { $unwind: '$student' },
        { $group: { _id: '$student.department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Enrollment.aggregate([{ $group: { _id: '$semester', count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
    ]);
    res.json({ totalEnrollments: await Enrollment.countDocuments(), statusStats, departmentStats, semesterStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course enrollment statistics' });
  }
});

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set.');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.error('MongoDB connection failed:', error.message));
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Student Management API listening on port ${PORT}`);
});
