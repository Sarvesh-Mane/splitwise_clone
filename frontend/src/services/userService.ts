import api from "./api";

export const getUsers = async () => {
    const response = await api.get('/api/users');
    return response.data;
};

export const createUser = async (name: string, email: string) => {
    const response = await api.post('/api/users', {name, email});
    return response.data;
};
