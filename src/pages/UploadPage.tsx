import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Upload, Loader2, Music, AlertCircle, CheckCircle, FolderOpen } from 'lucide-react';
import { ModernNav } from '../components/ModernNav';
import { TabVisualizer } from '../components/TabVisualizer';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface RawTabNote {
    time: number;
    duration: number;
    string: number | null;
    fret: number | null;
    pitch: number;
}

interface TabNote {
    time: number;
    duration: number;
    string: number;
    fret: number;
    pitch: number;
}

interface TabResponse {
    original: TabNote[];
    beginner: TabNote[];
}

interface HistoryItem {
    id: number;
    filename: string;
    tablature: RawTabNote[];
    tablature_beginner: RawTabNote[];
    preview: RawTabNote[];
}

const sanitizeNotes = (notes: RawTabNote[]): TabNote[] => {
    return notes
        .filter((note): note is TabNote => note.string !== null && note.fret !== null)
        .map(note => ({
            ...note,
            string: note.string,
            fret: note.fret,
        }));
};

const getErrorMessage = (err: unknown, fallback: string): string => {
    if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        if (typeof detail === 'string') {
            return detail;
        }

        return err.message || fallback;
    }

    if (err instanceof Error) {
        return err.message;
    }

    return fallback;
};

export const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fullResponse, setFullResponse] = useState<TabResponse | null>(null);
    const [displayMode, setDisplayMode] = useState<'original' | 'beginner'>('original');
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

    const token = localStorage.getItem('access_token');

    const clearAuthData = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        window.dispatchEvent(new Event('storage'));
    };

    const fetchHistory = async () => {
        if (!token) {
            setHistoryItems([]);
            setHistoryLoading(false);
            return;
        }

        try {
            setHistoryLoading(true);

            const response = await axios.get<HistoryItem[]>(`${API_BASE_URL}/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHistoryItems(response.data || []);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                clearAuthData();
            } else {
                console.error(err);
            }
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        if (!token) {
            setError('You need to be logged in to generate and save tablatures.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/predict-tab/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setFullResponse({
                original: sanitizeNotes(response.data.tablature || []),
                beginner: sanitizeNotes(response.data.tablature_beginner || []),
            });

            setDisplayMode('original');
            await fetchHistory();
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Error processing file.'));

            if (axios.isAxiosError(err) && err.response?.status === 401) {
                clearAuthData();
            }
        } finally {
            setLoading(false);
        }
    };

    const loadSavedTab = (item: HistoryItem) => {
        setFullResponse({
            original: sanitizeNotes(item.tablature || []),
            beginner: sanitizeNotes(item.tablature_beginner || []),
        });

        setDisplayMode('original');
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            <ModernNav />

            <div className="max-w-6xl mx-auto px-6 pt-32">
                <h1 className="text-3xl font-bold mb-8 text-center">Upload Your Music</h1>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 text-center backdrop-blur-sm">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".mp3,.wav,.flac"
                        onChange={handleFileChange}
                    />

                    {!file ? (
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4 group">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                <Upload size={32} className="text-slate-400 group-hover:text-white" />
                            </div>
                            <div>
                                <p className="text-lg font-medium">Click to upload MP3, WAV or FLAC</p>
                                <p className="text-sm text-slate-500">The generated tab will be saved to your account</p>
                            </div>
                        </label>
                    ) : (
                        <div className="flex flex-col items-center gap-4 animate-fade-in">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500">
                                <Music size={32} className="text-blue-400" />
                            </div>

                            <p className="text-xl font-medium">{file.name}</p>

                            <div className="flex gap-4 mt-2">
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-slate-400 hover:text-white text-sm"
                                >
                                    Change File
                                </button>

                                <button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" /> Processing
                                        </>
                                    ) : (
                                        'Generate & Save Tablature'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 flex items-center justify-center gap-2">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}
                </div>

                {fullResponse && (
                    <div className="mt-12 animate-fade-in-up">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle size={24} />
                                <h2 className="text-2xl font-bold text-white">Success! Here is your tab:</h2>
                            </div>

                            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                                <button
                                    onClick={() => setDisplayMode('original')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                                        displayMode === 'original'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Original Tab
                                </button>

                                <button
                                    onClick={() => setDisplayMode('beginner')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                                        displayMode === 'beginner'
                                            ? 'bg-green-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Beginner Friendly
                                </button>
                            </div>
                        </div>

                        <TabVisualizer
                            data={displayMode === 'original' ? fullResponse.original : fullResponse.beginner}
                        />
                    </div>
                )}

                <div className="mt-14">
                    <div className="flex items-center gap-3 mb-6">
                        <FolderOpen className="text-blue-400" size={24} />
                        <h2 className="text-2xl font-bold">Saved Tablatures</h2>
                    </div>

                    {historyLoading ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-slate-400 flex items-center justify-center gap-3">
                            <Loader2 className="animate-spin" size={20} />
                            Loading your history...
                        </div>
                    ) : historyItems.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                            You do not have any saved tablatures yet.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {historyItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{item.filename}</h3>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Original notes: {item.tablature?.length || 0} | Beginner notes:{' '}
                                            {item.tablature_beginner?.length || 0}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => loadSavedTab(item)}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition"
                                    >
                                        View Tablature
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

