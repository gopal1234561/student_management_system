const { connectDB, Student } = require('../_lib/db');

module.exports = async (req, res) => {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.status(200).json(students);
    }

    if (req.method === 'POST') {
      const student = await Student.create(req.body);
      return res.status(201).json(student);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({ error: `A student with this ${field} already exists` });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map((e) => e.message).join(', '),
      });
    }

    console.error(error);
    return res.status(500).json({ error: 'Failed to process student request' });
  }
};
