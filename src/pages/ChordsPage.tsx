import { useState } from 'react';
import { LayoutGrid, ChevronDown, Music, Hash } from 'lucide-react';
import { ModernNav } from '../components/ModernNav';

const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const GUITAR_STRINGS = [
    { name: 'e', index: 7 },
    { name: 'B', index: 2 },
    { name: 'G', index: 10 },
    { name: 'D', index: 5 },
    { name: 'A', index: 0 },
    { name: 'E', index: 7 },
];

const NUM_FRETS = 16;

const FORMULAS = {
    chords: {
        "Major": [0, 4, 7],
        "Minor": [0, 3, 7],
        "Major 7": [0, 4, 7, 11],
        "Minor 7": [0, 3, 7, 10],
        "Dominant 7": [0, 4, 7, 10],
        "Diminished": [0, 3, 6]
    },
    scales: {
        "Major": [0, 2, 4, 5, 7, 9, 11],
        "Minor (Natural)": [0, 2, 3, 5, 7, 8, 10],
        "Pentatonic Major": [0, 2, 4, 7, 9],
        "Pentatonic Minor": [0, 3, 5, 7, 10],
        "Blues": [0, 3, 5, 6, 7, 10],
        "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11]
    },
    arpeggios: {
        "Major Triad": [0, 4, 7],
        "Minor Triad": [0, 3, 7],
        "Maj7 Arp": [0, 4, 7, 11],
        "Min7 Arp": [0, 3, 7, 10],
        "Dom7 Arp": [0, 4, 7, 10]
    }
};

type Category = 'chords' | 'scales' | 'arpeggios';

export const ChordsPage = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('chords');
    const [rootNote, setRootNote] = useState('A');
    const [selectedType, setSelectedType] = useState('Major');

    const [isRootOpen, setIsRootOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const handleCategoryChange = (category: Category) => {
        setActiveCategory(category);
        setSelectedType(Object.keys(FORMULAS[category])[0]);
        setIsRootOpen(false);
        setIsTypeOpen(false);
    };

    const rootIndex = NOTES.indexOf(rootNote);
    const currentFormula = (FORMULAS[activeCategory] as Record<string, number[]>)[selectedType] || [];
    const activeNotesIndices = currentFormula.map(interval => (rootIndex + interval) % 12);

    const fretMarkers = [3, 5, 7, 9, 12, 15];

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <ModernNav />

            <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">

                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6">
                        <LayoutGrid size={32} className="text-rose-400" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Library & Explorer</h1>
                    <p className="text-slate-400">Discover chords, scales, and arpeggios across the entire fretboard.</p>
                </div>

                <div className="flex justify-center mb-10">
                    <div className="bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 flex gap-2">
                        {(['chords', 'scales', 'arpeggios'] as Category[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-6 py-2.5 rounded-xl font-bold capitalize transition-all duration-300 ${
                                    activeCategory === cat
                                        ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl mb-12 flex flex-wrap gap-6 justify-center items-end relative z-20">

                    <div className="flex flex-col gap-2 relative w-32">
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1"><Music size={12}/> Root Note</label>
                        <button
                            onClick={() => { setIsRootOpen(!isRootOpen); setIsTypeOpen(false); }}
                            className={`flex items-center justify-between bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 outline-none hover:border-rose-500/50 transition font-bold text-left ${isRootOpen ? 'border-rose-500 ring-2 ring-rose-500/20' : ''}`}
                        >
                            <span className="text-lg">{rootNote}</span>
                            <ChevronDown size={18} className={`text-rose-400 transition-transform duration-300 ${isRootOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isRootOpen && (
                            <div className="absolute top-full mt-2 left-0 w-48 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 grid grid-cols-3 gap-1 p-2 animate-fade-in-up">
                                {NOTES.map((n) => (
                                    <div
                                        key={n}
                                        onClick={() => { setRootNote(n); setIsRootOpen(false); }}
                                        className={`p-2 cursor-pointer transition-colors text-center font-bold rounded-lg
                                    ${rootNote === n ? 'bg-rose-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                                `}
                                    >
                                        {n}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 relative w-64">
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1"><Hash size={12}/> Type</label>
                        <button
                            onClick={() => { setIsTypeOpen(!isTypeOpen); setIsRootOpen(false); }}
                            className={`flex items-center justify-between bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 outline-none hover:border-rose-500/50 transition font-bold text-left ${isTypeOpen ? 'border-rose-500 ring-2 ring-rose-500/20' : ''}`}
                        >
                            <span className="truncate">{selectedType}</span>
                            <ChevronDown size={18} className={`text-rose-400 transition-transform duration-300 ${isTypeOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isTypeOpen && (
                            <div className="absolute top-full mt-2 left-0 w-full bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up max-h-64 overflow-y-auto custom-scrollbar">
                                {Object.keys(FORMULAS[activeCategory]).map((t) => (
                                    <div
                                        key={t}
                                        onClick={() => { setSelectedType(t); setIsTypeOpen(false); }}
                                        className={`px-4 py-3 cursor-pointer transition-colors text-sm font-medium flex items-center justify-between
                                    ${selectedType === t ? 'bg-rose-500/20 text-rose-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                                `}
                                    >
                                        {t}
                                        {selectedType === t && <div className="w-2 h-2 rounded-full bg-rose-400"></div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-x-auto custom-scrollbar">

                    <div className="min-w-[800px] relative mt-4 mb-4 select-none">

                        <div className="flex mb-2 items-end">
                            <div className="w-10 flex-shrink-0"></div>
                            <div className="w-4 flex-shrink-0"></div>

                            <div className="flex-1 flex">
                                {Array.from({ length: NUM_FRETS }).map((_, i) => (
                                    <div key={`label-${i}`} className="flex-1 text-center text-slate-500 font-mono text-xs font-bold">
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex">
                            <div className="w-10 flex-shrink-0 flex flex-col justify-between py-2 mr-2 bg-slate-900/50 rounded-l-lg border-y border-l border-slate-800">
                                {GUITAR_STRINGS.map((str, idx) => (
                                    <div key={`name-${idx}`} className="flex-1 flex items-center justify-center font-bold font-mono text-slate-400 text-sm h-12">
                                        {str.name}
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 relative bg-[#1a1515] rounded-r-lg border-y-4 border-r-4 border-slate-800 overflow-hidden shadow-inner">

                                <div className="absolute inset-0 flex">
                                    <div className="w-2 bg-slate-300 shadow-xl z-10 flex-shrink-0"></div>

                                    <div className="flex-1 flex ml-1">
                                        {Array.from({ length: NUM_FRETS }).map((_, i) => (
                                            <div key={`fretline-${i}`} className="flex-1 border-r-2 border-slate-600/40 bg-gradient-to-r from-transparent to-slate-800/20"></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex pl-3 pointer-events-none">
                                    {Array.from({ length: NUM_FRETS }).map((_, i) => {
                                        const fretNum = i + 1;
                                        const hasDot = fretMarkers.includes(fretNum);
                                        const hasDoubleDot = fretNum === 12;

                                        return (
                                            <div key={`marker-${i}`} className="flex-1 flex items-center justify-center">
                                                {hasDoubleDot ? (
                                                    <div className="flex flex-col gap-10 opacity-30">
                                                        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                                        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                                    </div>
                                                ) : hasDot ? (
                                                    <div className="w-3 h-3 rounded-full bg-slate-400 opacity-30"></div>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="relative z-20 flex flex-col py-2 h-full justify-between">
                                    {GUITAR_STRINGS.map((strData, stringIdx) => {
                                        const openNoteIndex = strData.index;

                                        return (
                                            <div key={`string-${stringIdx}`} className="relative flex-1 flex items-center h-12">

                                                <div
                                                    className="absolute left-0 right-0 bg-slate-400 shadow-sm"
                                                    style={{
                                                        height: `${1 + stringIdx * 0.5}px`,
                                                        opacity: 0.4 + (stringIdx * 0.1)
                                                    }}
                                                ></div>

                                                <div className="flex w-full h-full items-center relative">

                                                    <div className="w-3 flex-shrink-0 flex justify-center items-center z-30 -ml-1.5">
                                                        {activeNotesIndices.includes(openNoteIndex) && (
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg border
                                                        ${openNoteIndex === rootIndex
                                                                ? 'bg-rose-500 text-white border-white animate-pulse'
                                                                : 'bg-slate-800 text-white border-slate-600'
                                                            }`}
                                                            >
                                                                {NOTES[openNoteIndex]}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 flex h-full ml-1">
                                                        {Array.from({ length: NUM_FRETS }).map((_, fretIdx) => {
                                                            const noteIndexOnFret = (openNoteIndex + fretIdx + 1) % 12;
                                                            const noteName = NOTES[noteIndexOnFret];
                                                            const isActive = activeNotesIndices.includes(noteIndexOnFret);
                                                            const isRoot = noteIndexOnFret === rootIndex;

                                                            return (
                                                                <div key={`note-${stringIdx}-${fretIdx}`} className="flex-1 flex justify-center items-center relative">
                                                                    {isActive && (
                                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform hover:scale-125 cursor-default z-30
                                                                    ${isRoot
                                                                            ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] border-2 border-white'
                                                                            : 'bg-slate-700 text-slate-200 border border-slate-500'
                                                                        }`}
                                                                        >
                                                                            {noteName}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-6 flex justify-center gap-8 text-sm font-mono text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-rose-500 border border-white"></div>
                            <span>Root Note ({rootNote})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-500"></div>
                            <span>Scale / Chord Tone</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};


