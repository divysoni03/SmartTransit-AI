import { Link, useNavigate } from 'react-router-dom';
import { Bus, LogOut, User, History as HistoryIcon, ArrowRight, Clock, Users, Leaf, Map, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/useAuthStore';
import { useMapStore } from '../store/useStore';

const History = () => {
    const { scenarios, setOptimizationResult, setBoundary, deleteScenario } = useMapStore();
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleLoad = (scenario: any) => {
        setBoundary(scenario.boundary);
        setOptimizationResult(scenario.result);
        navigate('/optimize');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar — same as Optimize page */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm px-6 h-16 flex items-center justify-between z-10 shrink-0">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-1.5 flex items-center justify-center rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                        SmartTransit<span className="text-primary tracking-normal">.AI</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 pl-2 pr-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800">
                        <div className="bg-primary/10 text-primary p-1 rounded-full">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        {user?.name?.split(' ')[0] || 'User'}
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <HistoryIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Saved Scenarios</h1>
                            <p className="text-slate-500 text-sm">{scenarios.length} saved optimization{scenarios.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {scenarios.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="bg-slate-100 p-6 rounded-2xl mb-4">
                                <Map className="w-12 h-12 text-slate-400 mx-auto" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-700 mb-2">No Scenarios Saved</h2>
                            <p className="text-slate-500 mb-6 max-w-sm">Run a route optimization simulation and click "Save Scenario" to store your results here.</p>
                            <button onClick={() => navigate('/optimize')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                                Go to Optimize
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scenarios.map((scenario: any) => {
                                const m = scenario.metrics || {};
                                const routes = scenario.result?.routes || [];
                                const totalBuses = routes.reduce((acc: number, r: any) => acc + (r.buses_assigned || 0), 0);

                                return (
                                    <div key={scenario.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                        {/* Card Header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
                                            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
                                                {new Date(scenario.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                {' · '}
                                                {new Date(scenario.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-white font-bold text-lg mt-0.5">
                                                {scenario.result?.city?.replace(/_/g, ' ') || 'Unnamed City'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5 text-white text-xs font-medium">
                                                    <Bus className="w-3 h-3" />
                                                    {totalBuses} buses
                                                </div>
                                                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5 text-white text-xs font-medium">
                                                    {routes.length} routes
                                                </div>
                                            </div>
                                        </div>

                                        {/* Metrics Grid */}
                                        <div className="p-5">
                                            <div className="grid grid-cols-2 gap-3 mb-5">
                                                <div className="flex flex-col gap-1 bg-blue-50 border border-blue-100 rounded-lg p-3">
                                                    <span className="text-xs text-blue-500 font-medium flex items-center gap-1.5">
                                                        <Users className="w-3 h-3" /> Ridership
                                                    </span>
                                                    <span className="font-bold text-slate-800 text-sm">
                                                        {(m.estimated_ridership || 0).toLocaleString()}/day
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1 bg-green-50 border border-green-100 rounded-lg p-3">
                                                    <span className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                                                        <Map className="w-3 h-3" /> Coverage
                                                    </span>
                                                    <span className="font-bold text-slate-800 text-sm">
                                                        {Math.round((m.coverage || 0) * 100)}%
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1 bg-orange-50 border border-orange-100 rounded-lg p-3">
                                                    <span className="text-xs text-orange-500 font-medium flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" /> Avg Wait
                                                    </span>
                                                    <span className="font-bold text-slate-800 text-sm">
                                                        {m.avg_wait_time ?? '—'} min
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1 bg-purple-50 border border-purple-100 rounded-lg p-3">
                                                    <span className="text-xs text-purple-600 font-medium flex items-center gap-1.5">
                                                        <Leaf className="w-3 h-3" /> CO₂ Saved
                                                    </span>
                                                    <span className="font-bold text-slate-800 text-sm">
                                                        {m.co2_saved_kg_day ?? 0} kg/day
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleLoad(scenario)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white py-2.5 rounded-lg font-medium transition text-sm"
                                                >
                                                    Load Scenario
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteScenario(scenario.id)}
                                                    className="p-2.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                                                    title="Delete scenario"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
