
import { AnimatedSection } from '../animations/AnimatedSection';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2, Navigation, Layers, Users, Zap, Clock, BusFront, Settings } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


export const InteractivePreview = () => {
    // Mock Data for the Map
    const position: [number, number] = [28.6139, 77.2090]; // New Delhi center mock

    const routePoints: [number, number][] = [
        [28.6239, 77.2090], [28.6139, 77.2190], [28.6039, 77.2100], [28.6100, 77.1990]
    ];

    const markers: [number, number][] = [
        [28.6239, 77.2090], [28.6139, 77.2190], [28.6039, 77.2100], [28.6100, 77.1990]
    ];

    return (
        <section id="preview" className="py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-6 max-w-7xl">

                <AnimatedSection className="mb-12">
                    <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Live Sandbox</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        Interactive Deployment Plan
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                        Preview the output of our optimization engine. See calculated routes, estimated coverage, and projected costs instantly.
                    </p>
                </AnimatedSection>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Map Container */}
                    <AnimatedSection className="flex-1" delay={0.2} direction="left">
                        <div className="h-[600px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl relative z-10">
                            <MapContainer
                                center={position}
                                zoom={14}
                                scrollWheelZoom={false}
                                style={{ height: '100%', width: '100%' }}
                                className="z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Clean modern tiles
                                />

                                {/* Route Line */}
                                <Polyline
                                    positions={routePoints}
                                    color="#2563EB"
                                    weight={5}
                                    opacity={0.8}
                                />

                                {/* Stops */}
                                {markers.map((pos, idx) => (
                                    <CircleMarker
                                        key={idx}
                                        center={pos}
                                        radius={8}
                                        fillColor="#ffffff"
                                        color="#2563EB"
                                        weight={3}
                                        fillOpacity={1}
                                    />
                                ))}

                                {/* Coverage radius mocks */}
                                {markers.map((pos, idx) => (
                                    <CircleMarker
                                        key={`cov-${idx}`}
                                        center={pos}
                                        radius={40}
                                        fillColor="#2563EB"
                                        color="transparent"
                                        fillOpacity={0.1}
                                    />
                                ))}
                            </MapContainer>

                            {/* Overlay UI elements on Map */}
                            <div className="absolute top-4 right-4 z-[9999] flex flex-col gap-2">
                                <Button variant="secondary" size="icon" className="rounded-xl shadow-lg bg-white/90 backdrop-blur">
                                    <Layers className="h-4 w-4" />
                                </Button>
                                <Button variant="secondary" size="icon" className="rounded-xl shadow-lg bg-white/90 backdrop-blur text-primary">
                                    <Navigation className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Side Panel Metrics */}
                    <AnimatedSection className="w-full lg:w-[400px] flex flex-col gap-4" delay={0.4} direction="right">

                        <Card className="border-primary/20 shadow-lg shadow-primary/5">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" /> Plan Validated
                                    </h4>
                                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md">ID: ST-992A</span>
                                </div>

                                <div className="space-y-6 mt-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-500 flex items-center gap-1.5"><Users className="h-4 w-4" /> Coverage %</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-100">88.4%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '88.4%' }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><BusFront className="h-3 w-3" /> Buses</div>
                                            <div className="text-xl font-bold text-slate-800 dark:text-white">12</div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Hours</div>
                                            <div className="text-xl font-bold text-slate-800 dark:text-white">06:00 - 22:00</div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 col-span-2">
                                            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Zap className="h-3 w-3" /> Est. Cost (Monthly)</div>
                                            <div className="text-2xl font-bold text-slate-800 dark:text-white">$42,500 <span className="text-sm font-normal text-green-500">-15% vs baseline</span></div>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full mt-6 shadow-md shadow-primary/20">
                                    Export Plan Data (.CSV)
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-transparent border-dashed">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                    <Settings className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-slate-800 dark:text-slate-100">Want to run your own data?</h5>
                                    <p className="text-sm text-slate-500 mt-1">Upload a GeoJSON file to see customized AI routing.</p>
                                </div>
                                <Button variant="outline" className="w-full mt-2">Upload GeoJSON</Button>
                            </CardContent>
                        </Card>

                    </AnimatedSection>

                </div>
            </div>
        </section>
    );
};
