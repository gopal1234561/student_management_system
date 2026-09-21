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

const Student = mongoose.model('Student', studentSchema);

app.get('/', (req, res) => {
  res.json({
    service: 'Student Management System API',
    status: mongoose.connection.readyState === 1 ? 'connected' : 'starting',
    endpoints: ['/health', '/students', '/stats']
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
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({ error: `A student with this ${field} already exists` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({ error: `A student with this ${field} already exists` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(', ') });
    }
    res.status(400).json({ error: 'Failed to update student' });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
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

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set.');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(error => {
      console.error('MongoDB connection failed:', error.message);
    });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Student Management API listening on port ${PORT}`);
});