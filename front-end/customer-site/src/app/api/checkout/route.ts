// src/app/api/checkout/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = "https://app-food-order.azurewebsites.net";

const codPayment = async (req: NextApiRequest, res: NextApiResponse, orderModel: any) => {
  try {
    const response = await axios.post(`${API_URL}/customer/cart/cod`, orderModel, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process COD payment', details: error.message });
  }
};

const createPayPalOrder = async (req: NextApiRequest, res: NextApiResponse, orderModel: any) => {
  try {
    const response = await axios.post(`${API_URL}/customer/cart/create-paypal-order`, orderModel);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create PayPal order', details: error.message });
  }
};

const capturePayPalOrder = async (req: NextApiRequest, res: NextApiResponse, orderModel: any) => {
  const { orderId } = req.query;
  try {
    const response = await axios.post(`${API_URL}/customer/cart/capture-paypal-order`, orderModel, {
      params: { orderId },
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to capture PayPal order', details: error.message });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, url, body } = req;

  switch (true) {
    case method === 'POST' && url?.includes('/cod'):
      return codPayment(req, res, body);
    case method === 'POST' && url?.includes('/create-paypal-order'):
      return createPayPalOrder(req, res, body);
    case method === 'POST' && url?.includes('/capture-paypal-order'):
      return capturePayPalOrder(req, res, body);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
