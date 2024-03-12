const baseUrl = 'http://localhost:3000/api';
// const baseUrl = 'http://103.179.189.15:680/api';
import queryString from 'querystring';
import axios from 'axios';

export const doGet = async (path, params) => {
  const queryParams = queryString.stringify(params);

  return await axios.get(`${baseUrl}${path}?${queryParams}`);
};

export const doPost = async (path, body) => {
  return await axios.post(`${baseUrl}${path}`, body);
};
export const doPut = async (path, body) => {
  return await axios.put(`${baseUrl}${path}`, body);
};

export const doDelete = async (path, body) => {
  return await axios.delete(`${baseUrl}${path}`, body);
};
