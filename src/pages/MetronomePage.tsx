import { useState, useEffect, useRef } from 'react';
import { Play, Square, Plus, Minus, Activity, ChevronDown } from 'lucide-react';
import { ModernNav } from '../components/ModernNav';

export const MetronomePage = () => {
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [currentBeat, setCurrentBeat] = useState(-1);
    const [isSignatureOpen, setIsSignatureOpen] = useState(false);

    const timeSignatures = [
        { value: 3, label: "3/4 (Waltz)" },
        { value: 4, label: "4/4 (Standard)" },
        { value: 5, label: "5/4 (Complex)" },
        { value: 6, label: "6/8 (Compound)" },
        { value: 7, label: "7/8 (Odd)" }
    ];

    const currentSignatureLabel = timeSignatures.find(t => t.value === beatsPerMeasure)?.label;

    const audioCtxRef = useRef<AudioContext | null>(null);

    const playClick = (isFirstBeat: boolean) => {
        if (!audioCtxRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.frequency.value = isFirstBeat ? 1200 : 800;

        gainNode.gain.setValueAtTime(1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    };

    useEffect(() => {
        let interval: number;
        let beatIndex = 0;

        if (isPlaying) {
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            const intervalMs = (60 / bpm) * 1000;

            const tick = () => {
                playClick(beatIndex === 0);
                setCurrentBeat(beatIndex);
                beatIndex = (beatIndex + 1) % beatsPerMeasure;
            };

            tick();
            interval = setInterval(tick, intervalMs);
        }

        return () => clearInterval(interval);
    }, [isPlaying, bpm, beatsPerMeasure]);

    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setCurrentBeat(-1);
        } else {
            setIsPlaying(true);
        }
    };
    const changeBpm = (amount: number) => setBpm((prev) => Math.min(Math.max(30, prev + amount), 300));

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <ModernNav />

            <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <Activity size={32} className="text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Smart Metronome</h1>
                    <p className="text-slate-400">Perfect your timing and master complex rhythms.</p>
                </div>

                <div className="glass-panel rounded-3xl p-10 border border-slate-800 shadow-2xl relative">

                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-0">
                        {isPlaying && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full transition-opacity duration-500"></div>
                        )}
                    </div>

                    <div className="text-center mb-10 relative z-10">
                        <div className="text-[96px] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
                            {bpm}
                        </div>
                        <div className="text-emerald-400 font-mono tracking-widest uppercase text-sm mt-2 font-bold">BPM</div>
                    </div>

                    <div className="flex items-center gap-6 mb-12 relative z-10">
                        <button onClick={() => changeBpm(-1)} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition active:scale-95 text-slate-300">
                            <Minus size={24} />
                        </button>
                        <input
                            type="range"
                            min="30"
                            max="300"
                            value={bpm}
                            onChange={(e) => setBpm(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
               [&::-webkit-slider-thumb]:appearance-none
               [&::-webkit-slider-thumb]:w-5
               [&::-webkit-slider-thumb]:h-5
               [&::-webkit-slider-thumb]:bg-emerald-400
               [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(52,211,153,0.5)]
               [&::-webkit-slider-thumb]:transition-transform
               [&::-webkit-slider-thumb]:hover:scale-125"
                        />
                        <button onClick={() => changeBpm(1)} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition active:scale-95 text-slate-300">
                            <Plus size={24} />
                        </button>
                    </div>

                    <div className="flex justify-center gap-4 mb-12 relative z-10">
                        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-5 h-5 rounded-full transition-all duration-100 ${
                                    currentBeat === i
                                        ? (i === 0 ? 'bg-emerald-400 scale-125 shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 'bg-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.6)]')
                                        : 'bg-slate-800'
                                }`}
                            ></div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center relative z-10 border-t border-slate-800/50 pt-8 mt-4">

                        <div className="flex flex-col gap-2 relative w-48">
                            <label className="text-xs text-slate-500 font-mono uppercase tracking-wider">Time Signature</label>

                            <button
                                onClick={() => setIsSignatureOpen(!isSignatureOpen)}
                                className={`flex items-center justify-between bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 outline-none hover:border-emerald-500/50 transition font-bold text-left ${isSignatureOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''}`}
                            >
                                <span>{currentSignatureLabel}</span>
                                <ChevronDown
                                    size={18}
                                    className={`text-emerald-400 transition-transform duration-300 ${isSignatureOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isSignatureOpen && (
                                <div className="absolute bottom-full mb-2 left-0 w-full bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                                    {timeSignatures.map((sig) => (
                                        <div
                                            key={sig.value}
                                            onClick={() => {
                                                setBeatsPerMeasure(sig.value);
                                                setCurrentBeat(-1);
                                                setIsSignatureOpen(false);
                                            }}
                                            className={`px-4 py-3 cursor-pointer transition-colors text-sm font-medium flex items-center justify-between
                                        ${beatsPerMeasure === sig.value
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                    `}
                                        >
                                            {sig.label}
                                            {beatsPerMeasure === sig.value && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={togglePlay}
                            className={`flex items-center justify-center w-20 h-20 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
                                isPlaying
                                    ? 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20'
                                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
                            }`}
                        >
                            {isPlaying ? <Square size={32} className="text-white fill-current" /> : <Play size={36} className="text-white fill-current ml-2" />}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

