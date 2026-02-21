import React, { useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, LayersControl, useMapEvents, Marker, Polyline, Popup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useMapStore } from '../../store/useStore';
import { HeatmapLayer } from './HeatmapLayer';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

// Fix for default marker icons in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks for adding bus stops
const MapEventsListener = () => {
    const { addBusStop } = useMapStore();
    useMapEvents({
        click(e) {
            addBusStop({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
    });
    return null;
};

// Renders a route polyline using the precomputed OSMnx path from the backend
const RoutePolyline: React.FC<{ route: any; color: string }> = ({ route, color }) => {
    if (!route.path || route.path.length < 2) return null;

    const validPath = route.path.filter((s: any) => s && s.lat !== undefined && s.lng !== undefined);
    if (validPath.length < 2) return null;

    const pathCoords: [number, number][] = validPath.map((s: any) => [s.lat, s.lng]);

    return (
        <Polyline
            positions={pathCoords}
            pathOptions={{ color, weight: 5, opacity: 0.8 }}
        >
            <Popup>
                <div className="p-2 space-y-1 min-w-[150px]">
                    <h4 className="font-bold text-slate-800 border-b pb-1">Route {route.route_id}</h4>
                    <p className="text-sm text-slate-600"><strong>Buses:</strong> {route.buses_assigned}</p>
                    <p className="text-sm text-slate-600"><strong>Frequency:</strong> {route.frequency_min} mins</p>
                    <p className="text-sm text-slate-600"><strong>Wait Time:</strong> {route.avg_wait_time_min} mins</p>
                    <p className="text-sm text-slate-600"><strong>Travel Time:</strong> {route.travel_time_min} mins</p>
                    <p className="text-sm text-slate-600"><strong>Distance:</strong> {route.distance_km} km</p>
                </div>
            </Popup>
        </Polyline>
    );
};

export const OptimizeMap: React.FC = () => {
    const { boundary, setBoundary, clearBoundary, optimizationResult, busStops, clearBusStops } = useMapStore();
    const featureGroupRef = useRef<L.FeatureGroup>(null);

    const onCreated = (e: any) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const geojson = layer.toGeoJSON();
            setBoundary(geojson);

            // Remove previously drawn layers so we only have one polygon
            if (featureGroupRef.current) {
                const layers = featureGroupRef.current.getLayers();
                layers.forEach((l) => {
                    if (l !== layer) {
                        featureGroupRef.current?.removeLayer(l as any);
                    }
                });
            }
        }
    };

    const onDeleted = () => {
        clearBoundary();
    };

    const center: [number, number] = [20.5937, 78.9629]; // Center of India

    return (
        <div className="w-full h-full min-h-[400px] bg-slate-100 rounded relative flex flex-col">
            <div className="flex-grow min-h-[400px]">
                <MapContainer
                    center={center}
                    zoom={5}
                    style={{ height: '100%', width: '100%', minHeight: '400px', borderRadius: '0.5rem', zIndex: 0 }}
                >
                    <MapEventsListener />

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />

                    <FeatureGroup ref={featureGroupRef}>
                        <EditControl
                            position="topright"
                            onCreated={onCreated}
                            onDeleted={onDeleted}
                            draw={{
                                rectangle: false,
                                circle: false,
                                circlemarker: false,
                                marker: false,
                                polyline: false,
                                polygon: {
                                    allowIntersection: false,
                                    drawError: {
                                        color: '#e1e100',
                                        message: '<strong>Error:</strong> shape edges cannot cross!'
                                    },
                                    shapeOptions: {
                                        color: '#3b82f6'
                                    }
                                }
                            }}
                        />
                    </FeatureGroup>

                    {/* Render clicked Bus Stops natively on the map */}
                    {busStops.map((stop, index) => (
                        <Marker key={`bus-stop-${index}`} position={[stop.lat, stop.lng]} />
                    ))}

                    {/* Render newly optimized Bus Stops from the ML Service */}
                    {optimizationResult && optimizationResult.stops && optimizationResult.stops.length > 0 && (
                        <LayersControl position="topright">
                            <LayersControl.Overlay checked name="Optimized Stops">
                                <FeatureGroup>
                                    {optimizationResult.stops.map((stop: any) => (
                                        <Marker
                                            key={`opt-stop-${stop.id}`}
                                            position={[stop.lat, stop.lng]}
                                            icon={L.divIcon({
                                                className: 'custom-div-icon',
                                                html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
                                                iconSize: [12, 12],
                                                iconAnchor: [6, 6]
                                            })}
                                        />
                                    ))}
                                </FeatureGroup>
                            </LayersControl.Overlay>
                            <LayersControl.Overlay checked name="Bus Routes (Simulated)">
                                <FeatureGroup>
                                    {optimizationResult.routes && optimizationResult.routes.map((route: any, index: number) => {
                                        const routeColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
                                        const color = routeColors[index % routeColors.length];

                                        return (
                                            <RoutePolyline key={`route-${route.route_id}`} route={route} color={color} />
                                        );
                                    })}
                                </FeatureGroup>
                            </LayersControl.Overlay>
                            <LayersControl.Overlay checked name="Coverage Heatmap">
                                <FeatureGroup>
                                    {optimizationResult.coverage && <HeatmapLayer points={optimizationResult.coverage} />}
                                </FeatureGroup>
                            </LayersControl.Overlay>
                        </LayersControl>
                    )}
                </MapContainer>
            </div>

            {/* UI overlay to manage selected boundary and bus stops */}
            <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-4">
                {(boundary || busStops.length > 0) && (
                    <div className="bg-white p-4 rounded shadow-md border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">Map Selection</h3>

                        <div className="space-y-3">
                            {boundary && (
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-sm font-medium text-green-600">Polygon Active</p>
                                    <button
                                        onClick={() => {
                                            clearBoundary();
                                            if (featureGroupRef.current) {
                                                featureGroupRef.current.clearLayers();
                                            }
                                        }}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded text-xs font-semibold transition"
                                    >
                                        Clear Boundary
                                    </button>
                                </div>
                            )}

                            {busStops.length > 0 && (
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-sm font-medium text-blue-600">{busStops.length} Stops Chosen</p>
                                    <button
                                        onClick={() => clearBusStops()}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded text-xs font-semibold transition"
                                    >
                                        Clear Stops
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {optimizationResult && optimizationResult.metrics && (
                    <div className="bg-white p-4 rounded shadow-md border border-slate-200 w-64">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">Optimization Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Route Count:</span>
                                <span className="font-medium text-slate-800">{optimizationResult.routes?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">System Avg Wait:</span>
                                <span className="font-medium text-slate-800">{optimizationResult.metrics.avg_wait_time} min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Estimated Ridership:</span>
                                <span className="font-medium inline-flex items-center gap-1 text-slate-800">
                                    {optimizationResult.metrics.estimated_ridership}
                                    <span className="w-2 h-2 rounded-full bg-green-500" title="Good Ridership"></span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Coverage Score:</span>
                                <span className="font-medium text-slate-800">{(optimizationResult.metrics.coverage * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
