import api from './api';

export interface OptimizationPayload {
    city_name: string;
    boundary: any;
    bus_stops?: Array<{ lat: number; lng: number }>;
    num_buses: number;
    operating_hours: number;
    avg_speed: number;
    depot?: { lat: number; lng: number } | null;
}

export const optimizeService = {
    async runOptimization(payload: OptimizationPayload) {
        try {
            // NOTE: In a real scenario, this connects to the backend API.
            // Since this is a frontend sprint mock, if the backend is not available,
            // we can simulate a response after a delay.
            const response = await api.post('/api/optimize/start', payload);
            return response.data;
        } catch (error) {
            console.error("Optimize error:", error);
            throw error;
        }
    }
};
