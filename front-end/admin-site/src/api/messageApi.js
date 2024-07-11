import axios from "axios";

const API_URL = "https://localhost:7133";

export const getContacts = () => {
    return axios.get(`${API_URL}/admin/chat/contact-list`);
};

export const getMessages = (fromUser) => {
    return axios.post(`${API_URL}/admin/chat/get-messages`, { FromUser: fromUser });
};

export const saveMessage = (message) => {
    return axios.post(`${API_URL}/admin/chat/save-message`, message);
};

export const markAsRead = (fromUser) => {
    return axios.post(`${API_URL}/admin/chat/mark-as-read`, { FromUser: fromUser });
};

export const getUnreadMessagesCount = () => {
    return axios.get(`${API_URL}/admin/chat/unread-messages-count`);
};

export const getUnreadMessages = () => {
    return axios.get(`${API_URL}/admin/chat/unread-messages`);
};