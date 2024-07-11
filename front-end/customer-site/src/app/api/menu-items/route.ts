import axios from "axios";

const API_URL = "https://localhost:7133";

export const getAllItem = () => {
  return axios.get(`${API_URL}/customer/MenuItem`);
};

export const getItemByCategory = (id: any) => {
  return axios.get(`${API_URL}/customer/MenuItem/${id}`);
};