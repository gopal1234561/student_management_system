const { connectDB, Student } = require('./_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const [totalStudents, departmentStats, yearStats] = await Promise.all([
      Student.countDocuments(),
      Student.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Student.aggregate([
        { $group: { _id: '$enrollmentYear', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return res.status(200).json({ totalStudents, departmentStats, yearStats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch enrollment statistics' });
  }
};
