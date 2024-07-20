import axios from "axios";

const API_URL = "https://localhost:7133";

export const SendInquiry = (contactModel: any) => {
  return axios.post(`${API_URL}/customer/cuscontact/send-inquiry`, contactModel);
};