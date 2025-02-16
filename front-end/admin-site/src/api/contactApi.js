import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllContact = () => {
    return axios.get(`${API_URL}/admin/contact`);
};

export const answerContact = (formData) => {
    return axios.put(`${API_URL}/admin/contact/${formData.contactId}`, formData, {
        headers: {
            "Content-Type": "application/json",
        }
    });
};

export const deleteContact = (id) => {
    return axios.delete(`${API_URL}/admin/contact/${id}`);
};