import axios from "axios";

console.log(import.meta.env.VITE_API_URL);
const API_URL = import.meta.env.VITE_API_URL;

export const getContacts = () => {
    return axios.get(`${API_URL}/admin/chat/contact-list`);
};

export const getMessages = (userId) => {
    return axios.get(`${API_URL}/admin/chat/get-messages`, {
        params: {
            id: userId,
        },
    });
};

export const saveMessage = (message) => {
    return axios.post(`${API_URL}/admin/chat/save-message`, message);
};

export const markAsRead = (userId) => {
    return axios.put(`${API_URL}/admin/chat/mark-as-read`, { id: userId }, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const getUnreadMessagesCount = () => {
    return axios.get(`${API_URL}/admin/chat/unread-messages-count`);
};

export const getUnreadMessages = () => {
    return axios.get(`${API_URL}/admin/chat/unread-messages`);
};