import axios from "axios";

const API_URL = "https://localhost:7133";

export const getListCart = (id: any) => {
  return axios.get(`${API_URL}/customer/cart/list/${id}`);
};

export const getOrderDetails = (id: any) => {
  return axios.get(`${API_URL}/customer/cart/details/${id}`);
};