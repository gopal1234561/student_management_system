import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'https://student-management-system-1-cw3r.onrender.com').replace(/\/$/, '');
const BASE_URL = `${API_URL}/students`;

export const getAllStudents = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
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

export const getCourses = async () => {
  const response = await axios.get(`${API_URL}/courses`);
  return response.data;
};

export const createCourse = async (course) => {
  const response = await axios.post(`${API_URL}/courses`, course);
  return response.data;
};

export const updateCourse = async (id, course) => {\n  const response = await axios.put(`${API_URL}/courses/${id}`, course);\n  return response.data;\n};\n\nexport const deleteCourse = async (id) => {
  await axios.delete(`${API_URL}/courses/${id}`);
  return true;
};

export const getEnrollments = async () => {
  const response = await axios.get(`${API_URL}/enrollments`);
  return response.data;
};

export const createEnrollment = async (enrollment) => {
  const response = await axios.post(`${API_URL}/enrollments`, enrollment);
  return response.data;
};

export const updateEnrollment = async (id, enrollment) => {
  const response = await axios.put(`${API_URL}/enrollments/${id}`, enrollment);
  return response.data;
};

export const deleteEnrollment = async (id) => {
  await axios.delete(`${API_URL}/enrollments/${id}`);
  return true;
};

export const getCourseEnrollmentStats = async () => {
  const response = await axios.get(`${API_URL}/enrollment-stats`);
  return response.data;
};
