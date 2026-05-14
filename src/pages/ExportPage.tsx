import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    AlertCircle,
    CheckCircle,
    Download,
    FileText,
    FolderOpen,
    Loader2,
    Music,
    RefreshCw,
} from 'lucide-react';
import { ModernNav } from '../components/ModernNav';

const API_BASE_URL = 'http://127.0.0.1:8000';

type ExportVariant = 'original' | 'beginner';

interface RawTabNote {
    time: number;
    duration: number;
    string: number | null;
    fret: number | null;
    pitch: number;
}

interface HistoryItem {
    id: number;
    filename: string;
    tablature: RawTabNote[];
    tablature_beginner: RawTabNote[];
    preview: RawTabNote[];
}

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

const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storage'));
};

const getFilenameFromDisposition = (disposition?: string): string | null => {
    if (!disposition) {
        return null;
    }

    const match = disposition.match(/filename="?([^";]+)"?/i);
    return match?.[1] || null;
};

export const ExportPage = () => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
    const [variant, setVariant] = useState<ExportVariant>('original');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const token = localStorage.getItem('access_token');

    const selectedTab = useMemo(() => {
        return historyItems.find(item => item.id === selectedTabId) || null;
    }, [historyItems, selectedTabId]);

    const selectedVariantNotes = useMemo(() => {
        if (!selectedTab) {
            return [];
        }

        return variant === 'original'
            ? selectedTab.tablature || []
            : selectedTab.tablature_beginner || [];
    }, [selectedTab, variant]);

    const playableNotesCount = useMemo(() => {
        return selectedVariantNotes.filter(note => note.string !== null && note.fret !== null).length;
    }, [selectedVariantNotes]);

    const fetchHistory = async () => {
        if (!token) {
            setHistoryItems([]);
            setLoading(false);
            setError('You need to be logged in to export your tablatures.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await axios.get<HistoryItem[]>(`${API_BASE_URL}/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const items = response.data || [];
            setHistoryItems(items);

            if (items.length > 0) {
                setSelectedTabId(current => current ?? items[0].id);
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Could not load your saved tablatures.'));

            if (axios.isAxiosError(err) && err.response?.status === 401) {
                clearAuthData();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleExport = async () => {
        if (!selectedTab || !token) {
            setError('Please select a tablature first.');
            return;
        }

        try {
            setExporting(true);
            setError(null);
            setSuccess(null);

            const response = await axios.get(
                `${API_BASE_URL}/history/${selectedTab.id}/export-pdf`,
                {
                    params: { variant },
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            const headerFilename = getFilenameFromDisposition(response.headers['content-disposition']);

            link.href = downloadUrl;
            link.download = headerFilename || `${selectedTab.filename.replace(/\.[^/.]+$/, '')}_${variant}_tab.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setSuccess('PDF exported successfully.');
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Could not export PDF.'));

            if (axios.isAxiosError(err) && err.response?.status === 401) {
                clearAuthData();
            }
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            <ModernNav />

            <div className="max-w-6xl mx-auto px-6 pt-32">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-4">
                        <FileText size={16} /> PDF Export
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Export your Tablatures
                    </h1>

                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Choose one of your uploaded songs, select the original or beginner friendly version,
                        then download a PDF with the guitar tablature sheet.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <FolderOpen className="text-purple-400" size={24} />
                                <h2 className="text-2xl font-bold">My Tabs</h2>
                            </div>

                            <button
                                onClick={fetchHistory}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                        </div>

                        {loading ? (
                            <div className="min-h-[260px] flex items-center justify-center text-slate-400 gap-3">
                                <Loader2 className="animate-spin" size={22} />
                                Loading tablatures...
                            </div>
                        ) : historyItems.length === 0 ? (
                            <div className="min-h-[260px] flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-700 rounded-2xl p-8">
                                <Music size={36} className="mb-4 text-slate-500" />
                                <p className="font-semibold text-slate-300">No saved tablatures yet.</p>
                                <p className="text-sm mt-2">Upload an audio file first, then come back here to export it.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
                                {historyItems.map(item => {
                                    const isSelected = selectedTabId === item.id;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setSelectedTabId(item.id);
                                                setSuccess(null);
                                                setError(null);
                                            }}
                                            className={`text-left rounded-2xl p-5 border transition-all duration-300 ${
                                                isSelected
                                                    ? 'bg-purple-500/10 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.16)]'
                                                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white break-all">{item.filename}</h3>
                                                    <p className="text-sm text-slate-400 mt-2">
                                                        Original notes: {item.tablature?.length || 0} | Beginner notes:{' '}
                                                        {item.tablature_beginner?.length || 0}
                                                    </p>
                                                </div>

                                                {isSelected && (
                                                    <CheckCircle className="text-purple-300 flex-shrink-0" size={22} />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-2xl h-fit lg:sticky lg:top-28">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl font-bold">Export settings</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                                    Selected song
                                </label>
                                <div className="mt-2 rounded-2xl bg-slate-950/60 border border-slate-800 p-4 min-h-[84px]">
                                    {selectedTab ? (
                                        <>
                                            <p className="font-bold text-white break-all">{selectedTab.filename}</p>
                                            <p className="text-sm text-slate-400 mt-2">
                                                {playableNotesCount} playable notes in selected version
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-slate-400">No tablature selected.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                                    Version
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                    <button
                                        onClick={() => {
                                            setVariant('original');
                                            setSuccess(null);
                                        }}
                                        className={`rounded-2xl p-4 border text-left transition ${
                                            variant === 'original'
                                                ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                                        }`}
                                    >
                                        <p className="font-bold">Original Tab</p>
                                        <p className="text-xs opacity-80 mt-1">AI predicted guitar positions</p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setVariant('beginner');
                                            setSuccess(null);
                                        }}
                                        className={`rounded-2xl p-4 border text-left transition ${
                                            variant === 'beginner'
                                                ? 'bg-green-600 border-green-400 text-white shadow-lg'
                                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                                        }`}
                                    >
                                        <p className="font-bold">Beginner Friendly</p>
                                        <p className="text-xs opacity-80 mt-1">Optimized for first frets</p>
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-300 flex gap-3">
                                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-green-500/10 border border-green-500/40 rounded-2xl text-green-300 flex gap-3">
                                    <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                                    <span>{success}</span>
                                </div>
                            )}

                            <button
                                onClick={handleExport}
                                disabled={!selectedTab || exporting || loading}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white px-6 py-4 rounded-2xl font-black text-lg transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(168,85,247,0.22)]"
                            >
                                {exporting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={22} />
                                        Exporting PDF...
                                    </>
                                ) : (
                                    <>
                                        <Download size={22} />
                                        Export PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
