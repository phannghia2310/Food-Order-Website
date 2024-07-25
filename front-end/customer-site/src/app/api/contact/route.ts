import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_URL = "https://app-food-order.azurewebsites.net";

const sendInquiry = async (req: NextApiRequest, res: NextApiResponse) => {
  const contactModel = req.body;

  try {
    const response = await axios.post(
      `${API_URL}/customer/cuscontact/send-inquiry`,
      contactModel
    );
    res.status(200).json(response.data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Failed to send inquiry", details: error.message });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, url } = req;

  switch (true) {
    case method === "POST" && url?.includes("/save-message"):
      return sendInquiry(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
