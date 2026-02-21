
import { Upload, Settings, Cpu, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '../animations/AnimatedSection';

export const SolutionSection = () => {
    const steps = [
        {
            icon: <Upload className="h-6 w-6 text-primary" />,
            title: "1. Upload City Map",
            description: "Import standard GeoJSON or Shapefiles of your district, highlighting residential blocks, schools, and commercial zones.",
            delay: 0
        },
        {
            icon: <Settings className="h-6 w-6 text-primary" />,
            title: "2. Set Parameters",
            description: "Define your total bus count, operating hours, budget constraints, and prioritize service areas.",
            delay: 0.2
        },
        {
            icon: <Cpu className="h-6 w-6 text-primary" />,
            title: "3. AI Optimization",
            description: "Our proprietary machine learning engine processes the constraints and simulates thousands of scenarios in seconds.",
            delay: 0.4
        },
        {
            icon: <LineChart className="h-6 w-6 text-primary" />,
            title: "4. Deployment Plan",
            description: "Receive exact route geometries, stop locations, timetable recommendations, and estimated operation costs.",
            delay: 0.6
        }
    ];

    return (
        <section id="solution" className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-6 max-w-5xl">

                <AnimatedSection className="text-center mb-16">
                    <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">How it Works</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        AI-Driven Transit Optimization
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Transform chaos into efficiency. Our 4-step process replaces months of manual consulting work with instant, data-backed operational blueprints.
                    </p>
                </AnimatedSection>

                <div className="relative">
                    {/* Animated Connecting Line */}
                    <div className="absolute top-[3.5rem] left-0 w-full h-1 hidden md:block border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute top-[-2px] left-0 h-[2px] bg-primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <AnimatedSection key={index} delay={step.delay} className="relative z-10">
                                <div className="flex flex-col items-center text-center">

                                    {/* Step Icon with Pulse */}
                                    <div className="relative mb-6">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: step.delay + 0.3, type: "spring" }}
                                            className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center relative z-10"
                                        >
                                            {step.icon}
                                        </motion.div>

                                        {/* Background glow */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.1, 0.3]
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 3,
                                                delay: step.delay
                                            }}
                                            className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl -z-10"
                                        />
                                    </div>

                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                                        {step.title}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {step.description}
                                    </p>

                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};
