const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not configured');
}

let cached = globalThis.__mongoose;

if (!cached) {
  cached = globalThis.__mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true, trim: true },
  enrollmentYear: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = { connectDB, Student };
