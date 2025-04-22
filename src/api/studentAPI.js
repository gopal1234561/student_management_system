
import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_API_URL}/students`;
export const getAllStudents = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};
export const deleteStudent = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
export const getEnrollmentStats = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/stats`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching enrollment stats:', error);
    return {
      totalEnrollments: 0,
      departmentStats: [],
      yearStats: []
    };
  }
};
