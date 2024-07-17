import axios from "axios";

const API_URL = "https://localhost:7133";

export const codPayment = (orderModel:any) => {
  return axios.post(`${API_URL}/customer/cart/cod`, orderModel, {
    headers: {
      "Content-Type": "application/json",
    },
  })
};