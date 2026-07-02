import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type {User} from "@/types/User";
import * as authService from "@/services/authService";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
//undefined because there is no default user session when the app first loads.


//The AuthProvider is a wrapper component. 
// Any component placed inside it will have access to the authentication state.
export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount, validate the stored token by calling /me
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.getMe()
                .then((userData) => {
                    setUser(userData);
                })
                .catch(() => {
                    // Token is invalid/expired — clear it
                    authService.logout();
                    setUser(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authService.login(email, password);
        setUser(data.user);
    };

    const register = async (name: string, email: string, password: string) => {
        await authService.register(name, email, password);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        //exposing the data and functions to rest of our app
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user, //if user is object then true, if null then false
            isLoading,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

//Instead of writing useContext(AuthContext) in every single component, 
// you can just import and call useAuth()

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
