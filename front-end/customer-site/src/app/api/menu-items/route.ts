import axios from "axios";

const API_URL = "https://app-food-order.azurewebsites.net";

export const getAllItem = () => {
  return axios.get(`${API_URL}/customer/MenuItem`);
};

export const getItemByCategory = (id: any) => {
  return axios.get(`${API_URL}/customer/MenuItem/${id}`);
};