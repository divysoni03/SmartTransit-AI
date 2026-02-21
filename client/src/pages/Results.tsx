
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Map as MapIcon, ChevronLeft, Clock, Route as RouteIcon, MapPin } from 'lucide-react';
import { useMapStore } from '../store/useStore';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically adjust map view
const MapAutoFit: React.FC<{ path: [number, number][] }> = ({ path }) => {
    const map = useMap();
    React.useEffect(() => {
        if (path.length > 0) {
            const bounds = L.latLngBounds(path);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, path]);
    return null;
};

const Results = () => {
    const navigate = useNavigate();
    const { optimizationResult } = useMapStore();
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(
        optimizationResult?.routes?.[0]?.route_id || null
    );

    if (!optimizationResult) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
                <MapIcon className="w-16 h-16 text-slate-300" />
                <h2 className="text-xl font-semibold text-slate-700">No AI Optimization Data Found</h2>
                <p className="text-slate-500">Please run a route generation simulation first.</p>
                <button onClick={() => navigate('/optimize')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Return to Optimization
                </button>
            </div>
        );
    }

    const { routes, city } = optimizationResult;
    const totalBuses = routes.reduce((acc: number, r: any) => acc + r.buses_assigned, 0);

    const activeRoute = routes.find((r: any) => r.route_id === selectedRouteId) || routes[0];

    // Prepare coordinates for Leaflet ([lat, lng])
    const activePathGeo = activeRoute?.path?.map((p: any) => [p.lat, p.lng]) || [];
    const activeStopsGeo = activeRoute?.stops_list?.map((s: any) => [s.lat, s.lng]) || [];

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/optimize')} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Final Transit Report</h1>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase mt-0.5">{city.replace(/_/g, ' ')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Fleet Required</span>
                        <div className="flex items-center gap-2 text-blue-700">
                            <Bus className="w-6 h-6" />
                            <span className="text-2xl font-black">{totalBuses}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden h-0">
                {/* Left Panel: Route List */}
                <div className="w-1/3 min-w-[350px] max-w-[450px] bg-white border-r border-slate-200 flex flex-col h-full">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-semibold text-slate-700">Allocated Service Routes</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {routes.map((route: any) => (
                            <div
                                key={route.route_id}
                                onClick={() => setSelectedRouteId(route.route_id)}
                                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${selectedRouteId === route.route_id
                                    ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/20'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${selectedRouteId === route.route_id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {route.route_id}
                                        </div>
                                        <span className="font-semibold text-slate-800">{route.stops} Stops</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-blue-700 bg-blue-100/50 px-2.5 py-1 rounded-full text-sm font-bold">
                                        <Bus className="w-3.5 h-3.5" />
                                        {route.buses_assigned}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                                    <div className="flex flex-col bg-white border border-slate-100 p-2.5 rounded-lg">
                                        <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mb-1"><RouteIcon className="w-3 h-3" /> Distance</span>
                                        <span className="font-semibold text-slate-700">{route.distance_km} km</span>
                                    </div>
                                    <div className="flex flex-col bg-white border border-slate-100 p-2.5 rounded-lg">
                                        <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mb-1"><Clock className="w-3 h-3" /> Round Trip</span>
                                        <span className="font-semibold text-slate-700">{route.travel_time_min * 2} min</span>
                                    </div>
                                    <div className="flex flex-col bg-white border border-slate-100 p-2.5 rounded-lg">
                                        <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mb-1"><Clock className="w-3 h-3" /> Frequency</span>
                                        <span className="font-semibold text-emerald-600">Every {Math.round(route.frequency_min)}m</span>
                                    </div>
                                    <div className="flex flex-col bg-white border border-slate-100 p-2.5 rounded-lg">
                                        <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3" /> Demand</span>
                                        <span className="font-semibold text-purple-600">Score: {route.demand_score}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Map View */}
                <div className="flex-1 bg-slate-100 relative">
                    {activePathGeo.length > 0 ? (
                        <MapContainer
                            center={activePathGeo[0]}
                            zoom={13}
                            className="w-full h-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />

                            <MapAutoFit path={activePathGeo} />

                            {/* Draw Route Line */}
                            <Polyline positions={activePathGeo} color="#2563eb" weight={5} opacity={0.8} />

                            {/* Draw Stops */}
                            {activeStopsGeo.map((pos: any, idx: number) => (
                                <Marker key={idx} position={pos}>
                                    <Popup>
                                        <div className="font-semibold">Stop {idx + 1}</div>
                                        <div className="text-xs text-slate-500">Route {activeRoute.route_id}</div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                            Select a route to view its geometry on the map
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
