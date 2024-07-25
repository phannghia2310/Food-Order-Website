import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getOrderByStatus = (id) => {
    return axios.get(`${API_URL}/admin/order/get-order-by-status/${id}`);
};

export const getDetailByOrder = (id) => {
    return axios.get(`${API_URL}/admin/order/get-detail-by-order/${id}`);
};

export const changeOrderStatus = (id) => {
    return axios.put(`${API_URL}/admin/order/change-status/${id}`);
};