import axios from './axios';

export const apiGet = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export const apiPost = async (url, body) => {
  const response = await axios.post(url, body);
  return response.data;
};
export const apiPostWithImage = async (url, body) => {
  return axios.post(url, body, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const apiPutWithImage = async (url, body) => {
  return axios.put(url, body, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
export const apiPut = async (url, body) => {
  const response = await axios.put(url, body);
  return response.data;
};

export const apiDelete = async (url,body) => {
  const response = await axios.delete(url);
  return response.data;
};
