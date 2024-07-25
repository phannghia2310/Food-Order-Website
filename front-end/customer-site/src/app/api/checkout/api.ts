import axios from 'axios';

const API_URL = '/api/checkout';

export const codPayment = async (orderModel: any) => {
  try {
    const response = await axios.post(`${API_URL}/cod`, orderModel, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to process COD payment');
  }
};

export const createPayPalOrder = async (orderModel: any) => {
  try {
    const response = await axios.post(`${API_URL}/create-paypal-order`, orderModel);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create PayPal order');
  }
};

export const capturePayPalOrder = async (orderId: string) => {
  try {
    const response = await axios.post(`${API_URL}/capture-paypal-order`, {}, {
      params: { orderId },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to capture PayPal order');
  }
};
