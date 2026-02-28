import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Loader2, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { ModernNav } from '../components/ModernNav';
import { TabVisualizer } from '../components/TabVisualizer';

export const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tabData, setTabData] = useState<any[] | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setTabData(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {

            const response = await axios.post("http://127.0.0.1:8000/predict-tab/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response from server:", response.data);
            setTabData(response.data.tablature);
        } catch (err: any) {
            console.error(err);
            setError("Error processing file. Is the backend running? Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            <ModernNav />

            <div className="max-w-4xl mx-auto px-6 pt-32">
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
                                <p className="text-lg font-medium">Click to upload MP3 or WAV</p>
                                <p className="text-sm text-slate-500">Maximum file size: 10MB</p>
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
                                        <><Loader2 className="animate-spin" /> Processing </>
                                    ) : (
                                        "Generate Tablature"
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

                {tabData && (
                    <div className="mt-12 animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4 text-green-400">
                            <CheckCircle size={24} />
                            <h2 className="text-2xl font-bold text-white">Success! Here is your tab:</h2>
                        </div>

                        <TabVisualizer data={tabData} />

                        <div className="mt-6 flex justify-center gap-4">
                            <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg text-sm font-medium transition">
                                Download PDF (Coming Soon)
                            </button>
                            <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg text-sm font-medium transition">
                                Play MIDI (Coming Soon)
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};