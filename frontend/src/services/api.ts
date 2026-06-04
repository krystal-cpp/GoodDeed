import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export const authAPI = {
    register: (data: { username: string, email: string, name: string, password: string }) =>
        api.post('/auth/register', data),
    login: (data: { username: string, password: string }) =>
        api.post('/auth/login', data)
};

export const deedsAPI = {
    getMyDeeds: () =>
        api.get('/deeds'),
    fetchDeedById: (id: number) =>
        api.get(`/deeds/${id}`),
    createDeed: (data: { title: string, description?: string }) =>
        api.post('/deeds', data),
    updateDeed: (id: number, data: { title?: string, description?: string, status?: boolean }) =>
        api.put(`/deeds/${id}`, data),
    deleteDeed: (id: number) =>
        api.delete(`/deeds/${id}`)
};

export const friendsAPI = {
    fetchFriends: () =>
        api.get('/friends'),
    addFriend: (username: string) =>
        api.post('/friends/add', {username}),
    removeFriend: (friendId: number) =>
        api.delete(`/friends/${friendId}`),
    fetchFriendDeeds: (friendId: number) =>
        api.get(`/friends/${friendId}/deeds`)
};

export const usersAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: { username?: string, email?: string, name?: string, password?: string }) => 
        api.put('/users/profile', data),
    deleteProfile: () => api.delete('/users/profile')
};

export default api;