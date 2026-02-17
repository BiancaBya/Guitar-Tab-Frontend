import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, Menu, X } from 'lucide-react';

export const ModernNav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                        <Music size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition">
            TabGenius
          </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#features" className="hover:text-white transition">Features</a>
                    <a href="#how-it-works" className="hover:text-white transition">How it Works</a>

                    <Link to="/login">
                        <span className="hover:text-white transition cursor-pointer">Log in</span>
                    </Link>

                    <Link to="/register">
                        <button className="bg-white text-slate-950 px-5 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition transform hover:-translate-y-0.5 shadow-lg shadow-white/10">
                            Sign up
                        </button>
                    </Link>
                </div>

                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-slate-800 p-6 flex flex-col gap-4 shadow-2xl">
                    <a href="#features" className="text-slate-300 hover:text-white">Features</a>
                    <Link to="/login" className="text-slate-300 hover:text-white">Log in</Link>
                    <Link to="/register" className="bg-blue-600 text-center py-2 rounded-lg text-white font-medium">Sign up</Link>
                </div>
            )}
        </nav>
    );
};