
import { AnimatedSection } from '../animations/AnimatedSection';
import { Button } from '../ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const CTASection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background with modern sleekness */}
            <div className="absolute inset-0 bg-primary z-0" />

            {/* Dynamic patterns */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[150px] opacity-10 translate-x-1/3 -translate-y-1/3 z-0" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900 rounded-full blur-[120px] opacity-40 -translate-x-1/3 translate-y-1/3 z-0" />

            <div className="container mx-auto px-6 relative z-10">
                <AnimatedSection className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                        Ready to Plan Smarter <br /> Public Transport?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
                        Join the forward-thinking municipalities using SmartTransit AI to build the sustainable, accessible districts of tomorrow.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button size="lg" className="bg-white text-primary hover:bg-slate-50 border-none shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all font-semibold px-8 h-14 rounded-2xl text-lg">
                            Create First Deployment Plan <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white px-8 h-14 rounded-2xl text-lg">
                            Contact Sales <ChevronRight className="ml-1 h-5 w-5" />
                        </Button>
                    </div>

                    <p className="mt-8 text-sm text-blue-200">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};
