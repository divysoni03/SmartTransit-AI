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

    const [numBuses, setNumBuses] = useState(160);
    const [operatingHours, setOperatingHours] = useState(18);
    const [avgSpeed, setAvgSpeed] = useState(19);

    // Advanced ML Parameters
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [populationDensity, setPopulationDensity] = useState('metro');
    const [peakHours, setPeakHours] = useState('07:00-11:00, 17:00-22:00');
    const [commercialWeight, setCommercialWeight] = useState(2.0);
    const [residentialWeight, setResidentialWeight] = useState(1.2);
    const [schoolWeight, setSchoolWeight] = useState(1.3);
    const [minStopDistance, setMinStopDistance] = useState(350);
    const [maxWalkDistance, setMaxWalkDistance] = useState(500);

    const canSubmit = boundary !== null || busStops.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        let boundaryArray = undefined;
        if (boundary && boundary.type === 'Polygon' && boundary.coordinates && boundary.coordinates[0]) {
            boundaryArray = boundary.coordinates[0].map((coord: any) => ({ lng: coord[0], lat: coord[1] }));
        }

        const payload = {
            city_name: 'Custom Map Selection',
            boundary: boundaryArray, // Correctly shape to [{lat, lng}, ...]
            bus_stops: busStops.length > 0 ? busStops : undefined,
            num_buses: numBuses,
            operating_hours: operatingHours,
            avg_speed_kmph: avgSpeed,
            parameters: {
                population_density: populationDensity,
                peak_hours: peakHours.split(',').map(s => s.trim()),
                commercial_weight: commercialWeight,
                residential_weight: residentialWeight,
                school_weight: schoolWeight,
                min_stop_distance_m: minStopDistance,
                max_walk_distance_m: maxWalkDistance
            }
        };

        console.log('Sending to API:', payload);

        try {
            setIsOptimizing(true);
            setOptimizationError(null);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Total Buses Deployable</label>
                    <input
                        type="number" min="1" required
                        className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                        value={numBuses} onChange={(e) => setNumBuses(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Operating Hours</label>
                    <input
                        type="number" min="1" max="24" required
                        className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                        value={operatingHours} onChange={(e) => setOperatingHours(Number(e.target.value))}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-slate-700">Average Transit Speed (km/h)</label>
                    <input
                        type="number" min="1" required
                        className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                        value={avgSpeed} onChange={(e) => setAvgSpeed(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full bg-slate-50 p-3 text-left font-medium text-slate-700 hover:bg-slate-100 flex justify-between items-center transition-colors"
                >
                    Advanced AI Parameters
                    <span className="text-xl leading-none">{showAdvanced ? '−' : '+'}</span>
                </button>

                {showAdvanced && (
                    <div className="p-4 bg-white space-y-4 border-t border-slate-200 text-sm">
                        <div>
                            <label className="block font-medium mb-1 text-slate-600">Population Density Class</label>
                            <select
                                value={populationDensity} onChange={(e) => setPopulationDensity(e.target.value)}
                                className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="metro">Metro</option>
                                <option value="urban">Urban</option>
                                <option value="suburban">Suburban</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-slate-600">Peak Hours (comma separated)</label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                                value={peakHours} onChange={(e) => setPeakHours(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block font-medium mb-1 text-slate-600 truncate" title="Commercial Transit Weight">Commercial</label>
                                <input type="number" step="0.1" className="w-full border border-slate-300 rounded p-2" value={commercialWeight} onChange={(e) => setCommercialWeight(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className="block font-medium mb-1 text-slate-600 truncate" title="Residential Transit Weight">Residential</label>
                                <input type="number" step="0.1" className="w-full border border-slate-300 rounded p-2" value={residentialWeight} onChange={(e) => setResidentialWeight(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className="block font-medium mb-1 text-slate-600 truncate" title="School Transit Weight">School</label>
                                <input type="number" step="0.1" className="w-full border border-slate-300 rounded p-2" value={schoolWeight} onChange={(e) => setSchoolWeight(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block font-medium mb-1 text-slate-600">Min Stop Dist (m)</label>
                                <input type="number" className="w-full border border-slate-300 rounded p-2" value={minStopDistance} onChange={(e) => setMinStopDistance(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className="block font-medium mb-1 text-slate-600">Max Walk Dist (m)</label>
                                <input type="number" className="w-full border border-slate-300 rounded p-2" value={maxWalkDistance} onChange={(e) => setMaxWalkDistance(Number(e.target.value))} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={!canSubmit || isOptimizing}
                className={`w-full py-3 px-4 rounded text-base font-bold shadow-sm text-white transition-all ${canSubmit && !isOptimizing
                        ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                        : 'bg-slate-400 cursor-not-allowed'
                    }`}
            >
                {isOptimizing ? 'Generating AI Routes...' : canSubmit ? `Optimize ${busStops.length} Stops` : 'Map Stops or Draw Boundary'}
            </button>
        </form>
    );
};
