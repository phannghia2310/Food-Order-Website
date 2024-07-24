import axios from "axios";

const API_URL = "https://app-food-order.azurewebsites.net";

export const SendInquiry = (contactModel: any) => {
  return axios.post(`${API_URL}/customer/cuscontact/send-inquiry`, contactModel);
};