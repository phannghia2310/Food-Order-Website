import axios from "axios";

const API_URL = "https://localhost:7133";

export const SaveMessage = (message: any) => {
    return axios.post(`${API_URL}/customer/cuschat/save-message`, message, {
        headers: {
            "Content-Type": "application/json",
        }
    })
};