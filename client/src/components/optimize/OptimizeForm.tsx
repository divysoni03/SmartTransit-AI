import React, { useState } from 'react';
import { useMapStore } from '../../store/useStore';
import { optimizeService } from '../../lib/optimizeService';

export const OptimizeForm: React.FC = () => {
    const {
        boundary,
        busStops,
        setIsOptimizing,
        setOptimizationResult,
        setOptimizationError,
        isOptimizing
    } = useMapStore();
    const [numBuses, setNumBuses] = useState(20);
    const [operatingHours, setOperatingHours] = useState(12);
    const [avgSpeed, setAvgSpeed] = useState(30);

    const canSubmit = boundary !== null || busStops.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        const payload = {
            city_name: 'Custom Map Selection', // Require by current backend schema
            boundary: boundary || undefined, // Send undefined if no boundary
            bus_stops: busStops,
            num_buses: numBuses,
            operating_hours: operatingHours,
            avg_speed: avgSpeed
        };

        console.log('Sending to API:', payload);

        try {
            setIsOptimizing(true);
            setOptimizationError(null);

            // Try contacting the real backend, or fallback to mock
            let result;
            try {
                result = await optimizeService.runOptimization(payload);
            } catch (err) {
                console.warn("Backend unavailable, using mock response for frontend development");
                await new Promise(res => setTimeout(res, 2000));
                result = {
                    stops: {
                        type: "FeatureCollection",
                        features: [
                            { type: "Feature", geometry: { type: "Point", coordinates: [78.9629, 20.5937] }, properties: { id: 1 } },
                            { type: "Feature", geometry: { type: "Point", coordinates: [79.0, 21.0] }, properties: { id: 2 } }
                        ]
                    },
                    routes: {
                        type: "FeatureCollection",
                        features: [
                            { type: "Feature", geometry: { type: "LineString", coordinates: [[78.9629, 20.5937], [79.0, 21.0]] }, properties: { color: "#3b82f6" } }
                        ]
                    },
                    coverage: [
                        [20.5937, 78.9629, 0.8],
                        [20.6, 78.95, 0.5],
                        [20.58, 78.98, 0.9],
                        [21.0, 79.0, 0.7],
                        [20.95, 78.95, 0.4]
                    ],
                    metrics: {
                        total_km: 120,
                        avg_wait_time: 15,
                        utilization_rate: 85,
                        coverage_percent: 78
                    }
                };
            }

            setOptimizationResult(result);
            console.log("Optimization complete:", result);
        } catch (error: any) {
            setOptimizationError(error.message || "Failed to optimize routes");
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Number of Buses</label>
                <input
                    type="number"
                    min="1"
                    className="w-full border rounded p-2"
                    value={numBuses}
                    onChange={(e) => setNumBuses(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Operating Hours</label>
                <input
                    type="number"
                    min="1"
                    max="24"
                    className="w-full border rounded p-2"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Average Speed (km/h)</label>
                <input
                    type="number"
                    min="1"
                    className="w-full border rounded p-2"
                    value={avgSpeed}
                    onChange={(e) => setAvgSpeed(Number(e.target.value))}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={!canSubmit || isOptimizing}
                className={`w-full py-2 px-4 rounded font-semibold text-white transition ${canSubmit && !isOptimizing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
            >
                {isOptimizing ? 'Optimizing...' : canSubmit ? `Optimize ${busStops.length} Stops` : 'Map Stops or Draw Boundary'}
            </button>
        </form>
    );
};
