import axios from "axios";

const API_URL = "https://localhost:7133";

export const getAllUser = () => {
    return axios.get(`${API_URL}/admin/user`);
};

export const createUser = (formData) => {
    return axios.post(`${API_URL}/admin/user`, formData);
};

export const updateUser = (formData) => {
    return axios.put(`${API_URL}/admin/user/${formData.userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

export const deleteUser = (id) => {
    return axios.delete(`${API_URL}/admin/user/${id}`);
};

export const uploadImage = (selectedFile) => {
    const formData = new FormData();
    formData.append('Image', selectedFile);
    return axios.post(`${API_URL}/admin/user/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const userLogin = (formData) => {
    return axios.post(`${API_URL}/admin/user/login`, formData, {
        headers: { 
            'Content-Type': 'application/json', 
        },
    });
};