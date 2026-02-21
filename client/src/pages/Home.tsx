
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { ProblemSection } from '../components/home/ProblemSection';
import { SolutionSection } from '../components/home/SolutionSection';
import { VisionSection } from '../components/home/VisionSection';
import { FeatureGrid } from '../components/home/FeatureGrid';
import { InteractivePreview } from '../components/home/InteractivePreview';
import { CTASection } from '../components/home/CTASection';
import { Footer } from '../components/layout/Footer';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
            <Navbar />
            <main className="flex-grow">
                <HeroSection />
                <ProblemSection />
                <SolutionSection />
                <VisionSection />
                <FeatureGrid />
                <InteractivePreview />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
