import React, { useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, LayersControl, useMapEvents, Marker } from 'react-leaflet';
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
                        featureGroupRef.current?.removeLayer(l);
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

                    {optimizationResult && (
                        <LayersControl position="topright">
                            <LayersControl.Overlay checked name="Optimized Stops">
                                <FeatureGroup>
                                    {optimizationResult.stops && <GeoJSON data={optimizationResult.stops} />}
                                </FeatureGroup>
                            </LayersControl.Overlay>
                            <LayersControl.Overlay checked name="Bus Routes">
                                <FeatureGroup>
                                    {optimizationResult.routes && (
                                        <GeoJSON
                                            data={optimizationResult.routes}
                                            style={(feature: any) => ({
                                                color: feature?.properties?.color || '#3b82f6',
                                                weight: 4,
                                                opacity: 0.8
                                            })}
                                        />
                                    )}
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
            {(boundary || busStops.length > 0) && (
                <div className="absolute bottom-4 left-4 z-[400] bg-white p-4 rounded shadow-md border border-slate-200">
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
        </div>
    );
};
