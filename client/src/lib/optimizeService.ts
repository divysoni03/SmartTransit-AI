import axios from 'axios';

export interface OptimizationPayload {
    city_name: string;
    boundary?: Array<{ lat: number; lng: number }>;
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
            const response = await axios.post('http://localhost:5001/optimize', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Optimize error:", error);
            throw error;
        }
    }
};
