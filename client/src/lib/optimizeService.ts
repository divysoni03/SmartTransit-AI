import api from './api';

export interface OptimizationPayload {
    boundary: any;
    num_buses: number;
    operating_hours: number;
    avg_speed: number;
    depot: { lat: number; lng: number } | null;
}

export const optimizeService = {
    async runOptimization(payload: OptimizationPayload) {
        try {
            const apiPayload = {
                city_name: 'Custom Project', // Hardcoded for now
                boundary_geojson: payload.boundary,
                num_buses: payload.num_buses,
                operating_hours: payload.operating_hours,
                avg_speed: payload.avg_speed
            };
            const response = await api.post('/api/optimize/start', apiPayload);
            return response.data.result;
        } catch (error) {
            console.error("Optimize error:", error);
            throw error;
        }
    }
};
