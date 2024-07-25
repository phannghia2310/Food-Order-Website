import axios from "axios";

const API_URL = "/api/orders";

export const getListCart = (id: any) => {
  return axios.get(`${API_URL}?id=${id}&detail=list`);
};

export const getOrderDetails = (id: any) => {
  return axios.get(`${API_URL}?id=${id}&detail=details`);
};

export const changeStatus = (id: any) => {
  return axios.put(`${API_URL}?id=${id}&detail=change-status`);
};
