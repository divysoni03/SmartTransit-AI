import { create } from 'zustand';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

interface MapState {
    boundary: any | null;
    setBoundary: (boundary: any) => void;
    clearBoundary: () => void;

    optimizationResult: any | null;
    isOptimizing: boolean;
    optimizationError: string | null;
    setOptimizationResult: (result: any) => void;
    setIsOptimizing: (loading: boolean) => void;
    setOptimizationError: (error: string | null) => void;

    scenarios: any[];
    saveScenario: (scenario: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    }
}));

export const useMapStore = create<MapState>((set) => ({
    boundary: null,
    setBoundary: (boundary) => set({ boundary }),
    clearBoundary: () => set({ boundary: null }),

    optimizationResult: null,
    isOptimizing: false,
    optimizationError: null,
    setOptimizationResult: (result) => set({ optimizationResult: result }),
    setIsOptimizing: (loading) => set({ isOptimizing: loading }),
    setOptimizationError: (error) => set({ optimizationError: error }),

    scenarios: [],
    saveScenario: (scenario) => set((state) => ({ scenarios: [...state.scenarios, scenario] }))
}));
