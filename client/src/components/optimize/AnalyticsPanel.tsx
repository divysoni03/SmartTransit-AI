import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapStore } from '../../store/useStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const chartData = [
    { time: '06:00', utilization: 40 },
    { time: '08:00', utilization: 85 },
    { time: '10:00', utilization: 65 },
    { time: '12:00', utilization: 50 },
    { time: '14:00', utilization: 60 },
    { time: '17:00', utilization: 90 },
    { time: '20:00', utilization: 45 },
];

export const AnalyticsPanel: React.FC = () => {
    const { optimizationResult, saveScenario, boundary } = useMapStore();
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();

    if (!optimizationResult || !optimizationResult.metrics) {
        return null;
    }

    const handleSave = () => {
        const scenario = {
            id: Date.now(),
            date: new Date().toISOString(),
            metrics: optimizationResult.metrics,
            boundary,
            result: optimizationResult
        };
        saveScenario(scenario);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const { metrics } = optimizationResult;

    return (
        <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Deployment Metrics</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-600 mb-1">Estimated Riders</p>
                    <p className="text-2xl font-bold text-blue-900">{(metrics.estimated_ridership || 0).toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-green-600 mb-1">Avg Wait Time</p>
                    <p className="text-2xl font-bold text-green-900">{metrics.avg_wait_time} min</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-purple-600 mb-1">CO₂ Saved (kg/day)</p>
                    <p className="text-2xl font-bold text-purple-900">{metrics.co2_saved_kg_day}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <p className="text-sm text-orange-600 mb-1">Coverage</p>
                    <p className="text-2xl font-bold text-orange-900">{Math.round((metrics.coverage || 0) * 100)}%</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 col-span-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-indigo-600 mb-1">Level of Service Score</p>
                            <p className="text-2xl font-bold text-indigo-900">{metrics.los_score ?? '—'} / 100</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500 mb-1">Network Coverage</p>
                            <p className="text-xl font-bold text-slate-700">{metrics.network_km ?? '—'} km</p>
                        </div>
                    </div>
                    {metrics.los_score !== undefined && (
                        <div className="mt-2 h-2 bg-indigo-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                                style={{ width: `${metrics.los_score}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="h-48 w-full mt-4">
                <p className="text-sm font-medium mb-2 text-slate-600">Estimated Utilization Timeline</p>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="utilization" stroke="#3b82f6" fill="#bfdbfe" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex-1 py-2 px-4 rounded font-semibold text-white transition ${saved ? 'bg-green-500' : 'bg-slate-800 hover:bg-slate-900'
                        }`}
                >
                    {saved ? 'Saved!' : 'Save Scenario'}
                </button>
                <button
                    onClick={() => navigate('/results')}
                    className="flex-1 py-2 px-4 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    View Detailed Report
                </button>
            </div>
        </div>
    );
};
