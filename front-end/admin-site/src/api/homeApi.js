import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getStatistics = () => {
    return axios.get(`${API_URL}/admin/home/statistics`);  
};

export const getWeeklyOrders = () => {
    return axios.get(`${API_URL}/admin/home/weekly-orders`);
};

export const getTopSellingItems = () => {
    return axios.get(`${API_URL}/admin/home/top-selling-items`);
};

export const getMonthlyRevenue = () => {
    return axios.get(`${API_URL}/admin/home/monthly-revenue`);
};