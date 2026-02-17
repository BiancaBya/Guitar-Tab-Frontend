import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
// import { PlayCircle } from 'lucide-react';
import guitarBg from '../assets/guitar-bg.png';

export const ModernHero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">

            <div className="absolute inset-0 z-0">
                <img
                    src={guitarBg}
                    alt="Guitar Background"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
                    AI-Powered Music Transcription
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white drop-shadow-2xl">
                    Generate Guitar Tabs with AI <br />
                    <span className="text-gradient">Directly From Your Audio</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    TabGenius uses AI to instantly your favorite songs
                    convert them into accurate tablature
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Link to="/upload">
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30">
                            Get Started <ArrowRight size={20} />
                        </button>
                    </Link>

                    {/*<button className="flex items-center gap-2 glass-panel px-8 py-4 rounded-full text-lg font-medium text-white hover:bg-white/10 transition-all">*/}
                    {/*    <PlayCircle size={20} className="text-blue-400" /> Watch Demo*/}
                    {/*</button>*/}
                </div>

            </div>
        </section>
    );
};

