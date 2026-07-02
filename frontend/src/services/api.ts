import axios from 'axios';

const api = axios.create({baseURL: "http://localhost:9000"});

// Attach JWT token to every request
//Every single time app uses this api instance to fetch data,
//  this function triggers automatically.
//It sneaks into localStorage, grabs the 'token' saved during login, 
// and slaps it onto the HTTP headers as Authorization: Bearer <token>

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401 responses, clear token and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        //say for example a user leaves the app overnight, token expires then we should redirect him/her to login page 
        if (error.response?.status === 401) {
            //clearing from local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on login/register page
            if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;