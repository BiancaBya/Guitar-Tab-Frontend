import { Upload, Cpu, Download} from 'lucide-react';

const features = [
    {
        icon: <Upload size={32} className="text-blue-400" />,
        title: "Audio Upload & Processing",
        desc: "Support for MP3, WAV, and FLAC files. Just drag & drop your recording.",
        color: "bg-blue-500/10 border-blue-500/20"
    },
    {
        icon: <Cpu size={32} className="text-cyan-400" />,
        title: "AI Transcription Engine",
        desc: "Our CRNN model analyzes pitch and timing with 98% accuracy.",
        color: "bg-cyan-500/10 border-cyan-500/20"
    },
    {
        icon: <Download size={32} className="text-purple-400" />,
        title: "Instant Export",
        desc: "Download your tabs as PDF, MusicXML, or view them in our interactive player.",
        color: "bg-purple-500/10 border-purple-500/20"
    }
];

export const FeatureCards = () => {
    return (
        <section id="features" className="py-24 bg-slate-950 relative z-10">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TabGenius?</h2>
                    <p className="text-slate-400">Everything you need to transcribe music faster.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="glass-panel p-8 rounded-2xl hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

