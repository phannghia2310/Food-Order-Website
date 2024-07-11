import axios from "axios";

const API_URL = "https://localhost:7133";

export const getAllCategory = () => {
  return axios.get(`${API_URL}/customer/MenuCategory`);
};