import { Link } from 'react-router-dom';
import { Upload, Cpu, Download, Activity, Mic, LayoutGrid } from 'lucide-react';

const features = [
    {
        icon: <Upload size={32} className="text-blue-400 group-hover:-translate-y-1 transition-transform" />,
        title: "Audio Upload & Processing",
        desc: "Support for MP3, WAV, and FLAC files. Just drag & drop your recording.",
        color: "bg-blue-500/10 border-blue-500/20",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
        link: "/upload"
    },
    {
        icon: <Cpu size={32} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />,
        title: "Beginner Friendly Tabs",
        desc: "Instantly switch to simplified arrangements optimized for the first 4 frets. Access alternative fingerings that stay within the beginner zone.",
        color: "bg-cyan-500/10 border-cyan-500/20",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]",
        link: "/upload"
    },
    {
        icon: <Download size={32} className="text-purple-400 group-hover:translate-y-1 transition-transform" />,
        title: "Instant Export",
        desc: "Download your tabs as PDF, MusicXML, or view them in our interactive player.",
        color: "bg-purple-500/10 border-purple-500/20",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
        link: "/upload"
    },
    {
        icon: <Activity size={32} className="text-rose-400 group-hover:animate-pulse" />,
        title: "Smart Metronome",
        desc: "Keep perfect time with visual and audio beats. Supports complex time signatures and tap tempo.",
        color: "bg-rose-500/10 border-rose-500/20",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
        link: "/metronome"
    },
    {
        icon: <Mic size={32} className="text-amber-400 group-hover:-rotate-12 transition-transform duration-300" />,
        title: "High-Precision Tuner",
        desc: "Real-time chromatic tuner. Quickly switch between Standard, Drop D, and custom alternative tunings.",
        color: "bg-amber-500/10 border-amber-500/20",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
        link: "/tuner"
    },
    {
        icon: <LayoutGrid size={32} className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" />,
        title: "Chord & Scale Library",
        desc: "Interactive fretboard visualizer. Explore all chord shapes, CAGED positions, scale shapes and arpeggios across the neck.",
        color: "bg-emerald-500/10 border-emerald-500/20",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]",
        link: "/chords"
    }
];

export const FeatureCards = () => {
    return (
        <section id="features" className="py-24 bg-[#020617] relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">The Ultimate Guitar Hub</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Everything you need to transcribe, practice, and master your guitar skills in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, index) => (
                        <Link to={item.link} key={index} className="block">
                            <div className={`glass-panel h-full p-8 rounded-2xl border border-slate-800 transition-all duration-300 group hover:-translate-y-2 cursor-pointer ${item.glow}`}>
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${item.color}`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};