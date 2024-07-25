import axios from "axios";

const API_URL = "/api/menu-items";

export const getAllItems = () => {
  return axios.get(`${API_URL}`);
};

export const getItemByCategory = (id: any) => {
  return axios.get(`${API_URL}?id=${id}`);
};
