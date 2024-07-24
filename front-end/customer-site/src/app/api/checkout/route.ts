import axios from "axios";

const API_URL = "https://app-food-order.azurewebsites.net";

export const codPayment = (orderModel: any) => {
  return axios.post(`${API_URL}/customer/cart/cod`, orderModel, {
    headers: {
      "Content-Type": "application/json",
    },
  })
};

export const createPayPalOrder = (orderModel: any) => {
  return axios.post(`${API_URL}/customer/cart/create-paypal-order`, orderModel);
};

export const capturePayPalOrder = (orderId: any, orderModel: any) => {
  return axios.post(`${API_URL}/customer/cart/capture-paypal-order`, orderModel, {
    params: { orderId },
  });
};