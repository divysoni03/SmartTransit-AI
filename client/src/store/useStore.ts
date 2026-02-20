import { create } from 'zustand';

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
}

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

    optimizationResult: null,
    isOptimizing: false,
    optimizationError: null,
    setOptimizationResult: (result) => set({ optimizationResult: result }),
    setIsOptimizing: (loading) => set({ isOptimizing: loading }),
    setOptimizationError: (error) => set({ optimizationError: error }),

    scenarios: [],
    saveScenario: (scenario) => set((state) => ({ scenarios: [...state.scenarios, scenario] }))
}));
