import { ModernNav } from '../components/ModernNav';
import { ModernHero } from '../components/ModernHero';
import { FeatureCards } from '../components/FeatureCards';

const LandingPage = () => {
    return (
        <div className="bg-slate-950 min-h-screen">
            <ModernNav />
            <main>
                <ModernHero />
                <FeatureCards />
            </main>

            <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-900">
                © 2026 TabGenius. Built for Bachelor's Thesis.
            </footer>
        </div>
    );
};

export default LandingPage;

