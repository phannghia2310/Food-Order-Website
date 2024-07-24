import axios from "axios";

const API_URL = "https://app-food-order.azurewebsites.net";

export const getAllCategory = () => {
  return axios.get(`${API_URL}/customer/MenuCategory`);
};