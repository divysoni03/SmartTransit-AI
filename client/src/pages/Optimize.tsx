import { Link, useNavigate } from 'react-router-dom';
import { Bus, LogOut, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/useAuthStore';
import { OptimizeMap } from '../components/map/OptimizeMap';
import { OptimizeForm } from '../components/optimize/OptimizeForm';
import { AnalyticsPanel } from '../components/optimize/AnalyticsPanel';

const Optimize = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm px-6 h-16 flex items-center justify-between z-10 shrink-0">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-1.5 flex items-center justify-center rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                        SmartTransit<span className="text-primary tracking-normal">.AI</span>
                    </span>
                </Link>

                {/* Right Side - User Info & Logout */}
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

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-1 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-slate-800">Configuration</h2>
                            <OptimizeForm />
                        </div>
                        <AnalyticsPanel />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2 flex flex-col min-h-[600px]">
                        <h2 className="text-xl font-semibold mb-4">Map View</h2>
                        <div className="flex-1 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                            <OptimizeMap />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Optimize;
