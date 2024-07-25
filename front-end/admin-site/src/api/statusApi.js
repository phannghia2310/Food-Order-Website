import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllStatus = () => {
    return axios.get(`${API_URL}/admin/status`);
};

export const createStatus = (formData) => {
    return axios.post(`${API_URL}/admin/status`, formData);
};

export const updateStatus = (formData) => {
    return axios.put(`${API_URL}/admin/status/${formData.statusId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export const deleteStatus = (id) => {
    return axios.delete(`${API_URL}/admin/status/${id}`);
};