import axios from "axios";

const API_URL = "/api/customer";

export const SendInquiry = (contactModel: any) => {
  return axios.post(`${API_URL}/cuscontact/send-inquiry`, contactModel);
};