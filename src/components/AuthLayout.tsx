import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ModernNav } from './ModernNav';

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    buttonText: string;
    onSubmit: (username: string, password: string) => Promise<void>;
    footerText: string;
    footerLinkText: string;
    footerLinkTo: string;
}

const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        if (typeof detail === 'string') {
            return detail;
        }

        return err.message || 'Something went wrong.';
    }

    if (err instanceof Error) {
        return err.message;
    }

    return 'Something went wrong.';
};

export const AuthLayout = ({
                               title,
                               subtitle,
                               buttonText,
                               onSubmit,
                               footerText,
                               footerLinkText,
                               footerLinkTo,
                           }: AuthLayoutProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please complete all fields.');
            return;
        }

        setLoading(true);

        try {
            await onSubmit(username.trim(), password);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <ModernNav />

            <div className="max-w-md mx-auto px-6 pt-32 pb-16">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <p className="text-slate-400 mt-2">{subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                                placeholder="Enter your password"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
                        >
                            {loading ? 'Please wait...' : buttonText}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        {footerText}{' '}
                        <Link to={footerLinkTo} className="text-blue-400 hover:text-blue-300 font-medium">
                            {footerLinkText}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};


