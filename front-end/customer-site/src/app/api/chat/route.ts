import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const API_URL = "https://app-food-order.azurewebsites.net";

export const SaveMessage = (message: any) => {
    return axios.post(`${API_URL}/customer/cuschat/save-message`, message, {
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const saveMessage = async (req: NextApiRequest, res: NextApiResponse) => {
    const { message } = req.body;
    try {
        const response = await axios.post(`${API_URL}/customer/cuschat/save-message`, message, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, url } = req;

    switch(true) {
        case method === 'POST' && url?.includes('/save-message'):
            return saveMessage(req, res);
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default handler;