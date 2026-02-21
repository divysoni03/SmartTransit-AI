
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Play, ArrowRight, Activity, Map } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background styling elements */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 -z-10" />
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white dark:from-slate-950 to-transparent -z-10" />

            {/* Subtle modern mesh gradient blob */}
            <div className="absolute top-20 right-0 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }} />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content */}
                    <div className="flex-1 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-primary/20 text-primary text-sm font-semibold mb-6 border border-blue-200 dark:border-primary/30">
                                🚀 AI-Powered City Planning
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                                Design Public Transport in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Minutes</span>, Not Months.
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                                AI-powered bus deployment planning for emerging cities and new districts. Seamlessly connect your growing communities with intelligent routing.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/optimize">
                                    <Button size="lg" className="gap-2 text-lg">
                                        Start Planning <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="gap-2 text-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                    View Demo <Play className="h-5 w-5" />
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                Trusted by 50+ Cities
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                99.9% Optimization Rate
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Mock UI */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
                        className="flex-1 w-full max-w-2xl relative"
                    >
                        {/* Main Window */}
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                            <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2 bg-slate-50/50 dark:bg-slate-950/50">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                    <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="mx-auto bg-white dark:bg-slate-800 rounded-md px-32 py-1 text-xs text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                                    smarttransit.ai/dashboard
                                </div>
                            </div>

                            {/* Dashboard Content Mock */}
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Map className="h-5 w-5 text-primary" /> Active Deployments
                                    </h3>
                                    <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                                        Live Status: Optimal
                                    </div>
                                </div>

                                {/* Map Area Mock */}
                                <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 relative overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#2563EB 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                                    {/* Mock routes */}
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                                            d="M10,50 Q30,20 50,50 T90,50"
                                            fill="none"
                                            stroke="#2563EB"
                                            strokeWidth="3"
                                            className="drop-shadow-md"
                                        />
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 2.5, delay: 1.2, ease: "easeInOut" }}
                                            d="M20,80 Q40,90 60,60 T80,20"
                                            fill="none"
                                            stroke="#8B5CF6"
                                            strokeWidth="2"
                                            strokeDasharray="4 4"
                                        />
                                    </svg>

                                    {/* Mock markers */}
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.8 }} className="absolute h-4 w-4 bg-primary rounded-full border-4 border-white shadow-lg top-1/2 left-[10%] -translate-y-1/2 -translate-x-1/2"></motion.div>
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.0 }} className="absolute h-4 w-4 bg-primary rounded-full border-4 border-white shadow-lg top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2"></motion.div>
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.2 }} className="absolute h-4 w-4 bg-primary rounded-full border-4 border-white shadow-lg top-1/2 left-[90%] -translate-y-1/2 -translate-x-1/2"></motion.div>
                                </div>

                                {/* Metrics Mock */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div className="text-slate-500 text-xs mb-1 font-medium">Population Coverage</div>
                                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">84.2%</div>
                                        <div className="text-green-500 text-xs mt-1 font-medium flex items-center">
                                            <Activity className="h-3 w-3 mr-1" /> +12% optimized
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div className="text-slate-500 text-xs mb-1 font-medium">Fleet Efficiency</div>
                                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">92/100</div>
                                        <div className="text-primary text-xs mt-1 font-medium flex items-center">
                                            AI recommended
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating element */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -right-8 -bottom-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                    <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Route Generated</div>
                                    <div className="text-xs text-slate-500">2.4 seconds</div>
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
};
