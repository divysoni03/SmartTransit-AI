import api from './api';

export interface OptimizationPayload {
    city_name: string;
    boundary?: Array<{ lat: number; lng: number }>;
    bus_stops?: Array<{ lat: number; lng: number }>;
    num_buses: number;
    operating_hours: number;
    avg_speed_kmph: number;
    parameters: {
        population_density: string;
        peak_hours: string[];
        commercial_weight: number;
        residential_weight: number;
        school_weight: number;
        min_stop_distance_m: number;
        max_walk_distance_m: number;
    };
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
