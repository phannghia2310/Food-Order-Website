import axios from "axios";

const API_URL = "/api/categories";

export const getAllCategories = () => {
    return axios.get(`${API_URL}`);
}