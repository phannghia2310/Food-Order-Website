import axios from "axios";

const API_URL = "https://app-food-order.azurewebsites.net";

export const register = ({ name, email, password }: any) => {
  return axios.post(`${API_URL}/customer/auth/register`, { name, email, password });
};

export const signin = ({ email, password }: any) => {
  return axios.post(`${API_URL}/customer/auth/signin`, { email, password });
};

export const signinWithGoogle = (idToken: any) => {
  return axios.post(`${API_URL}/customer/auth/signin/google`, { idToken });
};

export const update = (id: any, data: any) => {
  return axios.put(`${API_URL}/customer/auth/update/${id}`, data, {
  });
};

export const upload = (formData: any) => {
  return axios.post(`${API_URL}/customer/auth/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};