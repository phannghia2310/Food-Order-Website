import axios from "axios";

const API_URL = "https://localhost:7133";

export const getListCart = (id: any) => {
  return axios.get(`${API_URL}/customer/cart/list/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getOrderDetails = (id: any) => {
  return axios.get(`${API_URL}/customer/cart/details/${id}`);
};

export const changeStatus = (id: any) => {
  return axios.put(`${API_URL}/customer/cart/change-status/${id}`);
};