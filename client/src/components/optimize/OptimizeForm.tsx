import React, { useState } from 'react';
import { useMapStore } from '../../store/useStore';
import { optimizeService } from '../../lib/optimizeService';

export const OptimizeForm: React.FC = () => {
    const {
        boundary,
        setIsOptimizing,
        setOptimizationResult,
        setOptimizationError,
        isOptimizing
    } = useMapStore();
    const [numBuses, setNumBuses] = useState(20);
    const [operatingHours, setOperatingHours] = useState(12);
    const [avgSpeed, setAvgSpeed] = useState(30);
    const [depotLat, setDepotLat] = useState('');
    const [depotLng, setDepotLng] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!boundary) return;

        const payload = {
            boundary,
            num_buses: numBuses,
            operating_hours: operatingHours,
            avg_speed: avgSpeed,
            depot: depotLat && depotLng ? { lat: Number(depotLat), lng: Number(depotLng) } : null
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
            <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Optional Depot Location</p>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        className="w-full border rounded p-2"
                        value={depotLat}
                        onChange={(e) => setDepotLat(e.target.value)}
                    />
                    <input
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        className="w-full border rounded p-2"
                        value={depotLng}
                        onChange={(e) => setDepotLng(e.target.value)}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!boundary || isOptimizing}
                className={`w-full py-2 px-4 rounded font-semibold text-white transition ${boundary && !isOptimizing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
            >
                {isOptimizing ? 'Optimizing...' : boundary ? 'Optimize Routes' : 'Draw Boundary First'}
            </button>
        </form>
    );
};
