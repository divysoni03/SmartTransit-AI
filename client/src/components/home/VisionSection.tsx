
import { AnimatedSection } from '../animations/AnimatedSection';

export const VisionSection = () => {
    return (
        <section className="relative py-32 overflow-hidden flex items-center justify-center">
            {/* Immersive Soft Gradient Background */}
            <div className="absolute inset-0 bg-slate-900 z-0" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-blue-800/60 to-slate-900/90 z-0 Mix-blend-overlay" />

            {/* Decorative blurred blobs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/40 rounded-full blur-[100px] mix-blend-screen opacity-50 z-0 animate-pulse" style={{ animationDuration: '7s' }} />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[120px] mix-blend-screen opacity-50 z-0 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

            <div className="container mx-auto px-6 relative z-10 text-center text-white">
                <AnimatedSection className="max-w-3xl mx-auto backdrop-blur-sm bg-white/5 p-10 md:p-16 rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                        Building Smarter, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">Connected Districts</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-blue-100 font-light leading-relaxed mb-6">
                        As new districts emerge from rural clusters, scalable infrastructure is no longer optional—it's imperative.
                    </p>

                    <p className="text-lg text-blue-200/80 leading-relaxed font-light">
                        AI-enabled governance provides the strategic foresight required for sustainable mobility planning. SmartTransit AI empowers decision-makers to launch data-backed routes that guarantee accessibility and accelerate economic growth across communities.
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};
