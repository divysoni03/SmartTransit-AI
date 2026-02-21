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
    busStops: Array<{ lat: number; lng: number }>;
    setBoundary: (boundary: any) => void;
    clearBoundary: () => void;
    addBusStop: (stop: { lat: number; lng: number }) => void;
    removeBusStop: (index: number) => void;
    clearBusStops: () => void;

    optimizationResult: any | null;
    isOptimizing: boolean;
    optimizationError: string | null;
    setOptimizationResult: (result: any) => void;
    setIsOptimizing: (loading: boolean) => void;
    setOptimizationError: (error: string | null) => void;

    scenarios: any[];
    saveScenario: (scenario: any) => void;
    deleteScenario: (id: number) => void;
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
    busStops: [],
    setBoundary: (boundary) => set({ boundary }),
    clearBoundary: () => set({ boundary: null }),
    addBusStop: (stop) => set((state) => ({ busStops: [...state.busStops, stop] })),
    removeBusStop: (index) => set((state) => ({
        busStops: state.busStops.filter((_, i) => i !== index)
    })),
    clearBusStops: () => set({ busStops: [] }),

    optimizationResult: (() => {
        try { return JSON.parse(localStorage.getItem('optimizationResult') || 'null'); } catch { return null; }
    })(),
    isOptimizing: false,
    optimizationError: null,
    setOptimizationResult: (result) => {
        try { localStorage.setItem('optimizationResult', JSON.stringify(result)); } catch { }
        set({ optimizationResult: result });
    },
    setIsOptimizing: (loading) => set({ isOptimizing: loading }),
    setOptimizationError: (error) => set({ optimizationError: error }),

    scenarios: (() => {
        try { return JSON.parse(localStorage.getItem('scenarios') || '[]'); } catch { return []; }
    })(),
    saveScenario: (scenario) => set((state) => {
        const updated = [...state.scenarios, scenario];
        try { localStorage.setItem('scenarios', JSON.stringify(updated)); } catch { }
        return { scenarios: updated };
    }),
    deleteScenario: (id: number) => set((state) => {
        const updated = state.scenarios.filter((s: any) => s.id !== id);
        try { localStorage.setItem('scenarios', JSON.stringify(updated)); } catch { }
        return { scenarios: updated };
    })
}));
