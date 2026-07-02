import api from "./api";
import type {User} from "@/types/User";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', {email, password});
    const data: AuthResponse = response.data;
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
    const response = await api.post('/api/auth/register', {name, email, password});
    return response.data;
};

export const getMe = async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
    const response = await api.put('/api/auth/change-password', {oldPassword, newPassword});
    return response.data;
};
