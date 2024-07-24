import axios from "axios";

const API_URL = "https://app-food-order.azurewebsites.net";

export const getAllProduct = () => {
    return axios.get(`${API_URL}/admin/product`);
};

export const createProduct = (formData) => {
    return axios.post(`${API_URL}/admin/product`, formData);
};

export const updateProduct = (formData) => {
    return axios.put(`${API_URL}/admin/product/${formData.productId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/admin/product/${id}`);
};

export const uploadProductImage = (selectedFile) => {
    const formData = new FormData();
    formData.append('Image', selectedFile);
    return axios.post(`${API_URL}/admin/product/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};