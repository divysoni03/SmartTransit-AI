import { create } from 'zustand';
import api from '../lib/api';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // initial state as checking
    error: null,

    login: async (credentials) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/api/auth/login', credentials);
            const { user, tokens } = response.data.data;

            localStorage.setItem('access_token', tokens.access.token);
            localStorage.setItem('refresh_token', tokens.refresh.token);

            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Login failed',
                isLoading: false
            });
            throw error;
        }
    },

    register: async (userData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/api/auth/register', userData);
            const { user, tokens } = response.data.data;

            localStorage.setItem('access_token', tokens.access.token);
            localStorage.setItem('refresh_token', tokens.refresh.token);

            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                isLoading: false
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false, error: null });
    },

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                set({ isAuthenticated: false, isLoading: false });
                return;
            }

            const response = await api.get('/api/auth/me');
            set({ user: response.data.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
