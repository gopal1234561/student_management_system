import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'https://student-management-system-backend-e521.onrender.com').replace(/\/$/, '');
const BASE_URL = `${API_URL}/students`;

export const getAllStudents = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const deleteStudent = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return true;
};

export const getEnrollmentStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};
