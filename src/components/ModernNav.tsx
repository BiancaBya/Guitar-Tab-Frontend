import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Menu, X } from 'lucide-react';

export const ModernNav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);

        const syncAuthState = () => {
            const token = localStorage.getItem('access_token');
            const savedUsername = localStorage.getItem('username') || '';
            setIsLoggedIn(!!token);
            setUsername(savedUsername);
        };

        syncAuthState();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', syncAuthState);
        window.addEventListener('focus', syncAuthState);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', syncAuthState);
            window.removeEventListener('focus', syncAuthState);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        setMobileMenuOpen(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

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

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                    {isLoggedIn ? (
                        <>
                            <span className="text-slate-400">
                                Hi, <span className="text-white font-semibold">{username}</span>
                            </span>

                            <Link to="/upload" className="hover:text-white transition">
                                My Tabs
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-white text-slate-950 px-5 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition transform hover:-translate-y-0.5 shadow-lg shadow-white/10"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <span className="hover:text-white transition cursor-pointer">Log in</span>
                            </Link>

                            <Link to="/register">
                                <button className="bg-white text-slate-950 px-5 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition transform hover:-translate-y-0.5 shadow-lg shadow-white/10">
                                    Sign up
                                </button>
                            </Link>
                        </>
                    )}
                </div>

                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-slate-800 p-6 flex flex-col gap-4 shadow-2xl">
                    {isLoggedIn ? (
                        <>
                            <div className="text-slate-300">
                                Hi, <span className="text-white font-semibold">{username}</span>
                            </div>

                            <Link
                                to="/upload"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-300 hover:text-white"
                            >
                                My Tabs
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-blue-600 text-center py-2 rounded-lg text-white font-medium"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-300 hover:text-white"
                            >
                                Log in
                            </Link>

                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="bg-blue-600 text-center py-2 rounded-lg text-white font-medium"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

