const { connectDB, Student } = require('../_lib/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    if (req.method === 'GET') {
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ error: 'Student not found' });
      return res.status(200).json(student);
    }

    if (req.method === 'PUT') {
      const student = await Student.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!student) return res.status(404).json({ error: 'Student not found' });
      return res.status(200).json(student);
    }

    if (req.method === 'DELETE') {
      const student = await Student.findByIdAndDelete(id);
      if (!student) return res.status(404).json({ error: 'Student not found' });
      return res.status(200).json({ message: 'Student deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Failed to process student request' });
  }
};
