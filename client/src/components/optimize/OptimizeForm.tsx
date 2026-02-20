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
            // Pass directly without swallowing the error into a mock
            const result = await optimizeService.runOptimization(payload);
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
