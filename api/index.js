module.exports = (req, res) => {
  res.status(200).json({
    service: 'Student Management System API',
    status: 'ok',
    endpoints: ['/api/health', '/api/students', '/api/stats'],
  });
};
