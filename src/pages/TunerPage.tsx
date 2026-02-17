import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings2, ChevronDown } from 'lucide-react';
import { ModernNav } from '../components/ModernNav';

const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const tunings = {
    "Standard": ["E2", "A2", "D3", "G3", "B3", "E4"],
    "Drop D": ["D2", "A2", "D3", "G3", "B3", "E4"],
    "Half Step Down": ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
    "Open G": ["D2", "G2", "D3", "G3", "B3", "D4"]
};

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

export const TunerPage = () => {
    const [isListening, setIsListening] = useState(false);
    const [pitch, setPitch] = useState<number>(0);
    const [note, setNote] = useState<string>("--");
    const [cents, setCents] = useState<number>(0);
    const [selectedTuning, setSelectedTuning] = useState<keyof typeof tunings>("Standard");
    const [isTuningOpen, setIsTuningOpen] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number>(0);

    const noteFromPitch = (frequency: number) => {
        const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
        return Math.round(noteNum) + 69;
    };

    const frequencyFromNoteNumber = (note: number) => {
        return 440 * Math.pow(2, (note - 69) / 12);
    };

    const centsOffFromPitch = (frequency: number, noteNum: number) => {
        return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(noteNum)) / Math.log(2));
    };

    const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
        let SIZE = buf.length;
        let rms = 0;
        for (let i = 0; i < SIZE; i++) {
            const val = buf[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01) return -1;

        let r1 = 0, r2 = SIZE - 1;
        const thres = 0.2;
        for (let i = 0; i < SIZE / 2; i++)
            if (Math.abs(buf[i]) < thres) { r1 = i; break; }
        for (let i = 1; i < SIZE / 2; i++)
            if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

        buf = buf.slice(r1, r2);
        SIZE = buf.length;

        const c = new Array(SIZE).fill(0);
        for (let i = 0; i < SIZE; i++)
            for (let j = 0; j < SIZE - i; j++)
                c[i] = c[i] + buf[j] * buf[j + i];

        let d = 0; while (c[d] > c[d + 1]) d++;
        let maxval = -1, maxpos = -1;
        for (let i = d; i < SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        let T0 = maxpos;
        const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
        const a = (x1 + x3 - 2 * x2) / 2;
        const b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);

        return sampleRate / T0;
    };

    const updatePitch = () => {
        if (!analyserRef.current || !audioContextRef.current) return;

        const buffer = new Float32Array(analyserRef.current.fftSize);
        analyserRef.current.getFloatTimeDomainData(buffer);
        const ac = autoCorrelate(buffer, audioContextRef.current.sampleRate);

        if (ac !== -1) {
            const pitchValue = ac;
            setPitch(pitchValue);
            const noteNum = noteFromPitch(pitchValue);
            setNote(noteStrings[noteNum % 12]);
            setCents(centsOffFromPitch(pitchValue, noteNum));
        }

        if (isListening) {
            animationFrameRef.current = requestAnimationFrame(updatePitch);
        }
    };

    const toggleListening = async () => {
        if (isListening) {
            setIsListening(false);
            cancelAnimationFrame(animationFrameRef.current);
            if (sourceRef.current) sourceRef.current.disconnect();
            if (audioContextRef.current) audioContextRef.current.close();
            setNote("--");
            setCents(0);
            setPitch(0);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContextRef.current = new (window.AudioContext || (window as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 2048;
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                sourceRef.current.connect(analyserRef.current);

                setIsListening(true);
            } catch (err) {
                console.error("Microphone access denied", err);
                alert("Please allow microphone access to use the tuner.");
            }
        }
    };

    useEffect(() => {
        if (isListening) {
            updatePitch();
        }
    }, [isListening]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const isPerfect = Math.abs(cents) < 5 && note !== "--";
    const colorClass = isPerfect ? 'text-emerald-400' : (note !== "--" ? 'text-amber-400' : 'text-slate-500');
    const glowClass = isPerfect ? 'shadow-[0_0_60px_-15px_rgba(52,211,153,0.5)]' : '';

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <ModernNav />

            <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">

                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
                        <Settings2 size={32} className="text-amber-400" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Chromatic Tuner</h1>
                    <p className="text-slate-400">High-precision real-time tuning via your microphone.</p>
                </div>

                <div className={`glass-panel rounded-3xl p-10 border border-slate-800 transition-all duration-500 relative ${glowClass}`}>

                    <div className="text-center mb-8 relative z-10">
                        <div className={`text-[140px] font-extrabold leading-none tracking-tighter transition-colors duration-200 ${colorClass}`}>
                            {note}
                        </div>
                        <div className="text-slate-400 font-mono tracking-widest text-sm mt-4">
                            {pitch > 0 ? `${pitch.toFixed(1)} Hz` : 'Awaiting audio...'}
                        </div>
                    </div>

                    <div className="relative w-full h-16 mb-12 flex items-center justify-center">
                        <div className="absolute w-full h-1 bg-slate-800 rounded-full"></div>

                        <div className={`absolute w-1 h-8 transition-colors ${isPerfect ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>

                        <div className="absolute left-0 w-[2px] h-4 bg-slate-700"></div>
                        <div className="absolute right-0 w-[2px] h-4 bg-slate-700"></div>

                        {note !== "--" && (
                            <div
                                className={`absolute w-3 h-10 rounded-full transition-all duration-100 shadow-lg ${isPerfect ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                style={{
                                    left: `calc(50% + ${cents}%)`,
                                    transform: 'translateX(-50%)'
                                }}
                            ></div>
                        )}
                    </div>

                    <div className="text-center mb-12 h-6">
                        {note !== "--" && (
                            <span className={`font-bold tracking-widest uppercase text-sm ${colorClass}`}>
                     {Math.abs(cents) < 5 ? "Perfect" : (cents < 0 ? "Flat (Tune Up)" : "Sharp (Tune Down)")}
                 </span>
                        )}
                    </div>

                    <div className="flex justify-between items-center relative z-10 border-t border-slate-800/50 pt-8 mt-4">

                        <div className="flex flex-col gap-2 relative w-48">
                            <label className="text-xs text-slate-500 font-mono uppercase tracking-wider">Target Tuning</label>

                            <button
                                onClick={() => setIsTuningOpen(!isTuningOpen)}
                                className={`flex items-center justify-between bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 outline-none hover:border-amber-500/50 transition font-bold text-left ${isTuningOpen ? 'border-amber-500 ring-2 ring-amber-500/20' : ''}`}
                            >
                                <span>{selectedTuning}</span>
                                <ChevronDown
                                    size={18}
                                    className={`text-amber-400 transition-transform duration-300 ${isTuningOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isTuningOpen && (
                                <div className="absolute bottom-full mb-2 left-0 w-full bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                                    {Object.keys(tunings).map((t) => (
                                        <div
                                            key={t}
                                            onClick={() => {
                                                setSelectedTuning(t as keyof typeof tunings);
                                                setIsTuningOpen(false);
                                            }}
                                            className={`px-4 py-3 cursor-pointer transition-colors text-sm font-medium flex items-center justify-between
                                        ${selectedTuning === t
                                                ? 'bg-amber-500/20 text-amber-400' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                                            }
                                    `}
                                        >
                                            {t}
                                            {selectedTuning === t && <div className="w-2 h-2 rounded-full bg-amber-400"></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={toggleListening}
                            className={`flex items-center justify-center w-20 h-20 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
                                isListening
                                    ? 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20'
                                    : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                            }`}
                        >
                            {isListening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
                        </button>
                    </div>

                </div>

                <div className="mt-8 flex justify-center gap-4">
                    {tunings[selectedTuning].map((stringNote, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 font-bold bg-slate-900/50">
                            {stringNote}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
