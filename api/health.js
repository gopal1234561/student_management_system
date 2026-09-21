const { connectDB } = require('./_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ status: 'database-not-connected' });
  }
};
