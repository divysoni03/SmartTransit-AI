
import { Clock, MapPinOff, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { AnimatedSection } from '../animations/AnimatedSection';

export const ProblemSection = () => {
    const problems = [
        {
            icon: <Clock className="h-6 w-6 text-amber-500" />,
            title: "Manual Planning is Slow",
            description: "Traditional transport planning relies on outdated surveys and manual mapping, taking months to roll out routes while cities continue to grow.",
            color: "bg-amber-100 dark:bg-amber-900/30",
            delay: 0.1
        },
        {
            icon: <MapPinOff className="h-6 w-6 text-red-500" />,
            title: "Poor District Coverage",
            description: "New and emerging districts often remain disconnected from central hubs, forcing residents to rely on unsafe or expensive private alternatives.",
            color: "bg-red-100 dark:bg-red-900/30",
            delay: 0.2
        },
        {
            icon: <TrendingDown className="h-6 w-6 text-blue-500" />,
            title: "Inefficient Budget Allocation",
            description: "Without data-driven optimization, fleets operate on low-demand routes resulting in empty buses, high fuel costs, and wasted resources.",
            color: "bg-blue-100 dark:bg-blue-900/30",
            delay: 0.3
        }
    ];

    return (
        <section id="problem" className="py-24 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6">

                <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">The Problem</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        The Challenge Facing Growing Cities.
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Rapid urbanization is outpacing infrastructure. Existing planning methods are simply not equipped to handle the dynamic needs of expanding metropolitan populations.
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {problems.map((problem, index) => (
                        <AnimatedSection key={index} delay={problem.delay}>
                            <Card className="h-full border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden group">
                                {/* Subtle gradient glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <CardHeader>
                                    <div className={`w-14 h-14 rounded-2xl ${problem.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                        {problem.icon}
                                    </div>
                                    <CardTitle className="text-xl">{problem.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        {problem.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>

            </div>
        </section>
    );
};
