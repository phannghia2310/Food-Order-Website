import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllCategory = () => {
    return axios.get(`${API_URL}/admin/category`);
};

export const createCategory = (formData) => {
    return axios.post(`${API_URL}/admin/category`, formData);
};

export const updateCategory = (formData) => {
    return axios.put(`${API_URL}/admin/category/${formData.categoryId}`, formData, {
        headers: { 
            "Content-Type": "application/json",
        }
    });
};

export const deleteCategory = (id) => {
    return axios.delete(`${API_URL}/admin/category/${id}`);
};

