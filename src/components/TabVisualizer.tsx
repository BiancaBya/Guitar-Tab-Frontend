import React, { useMemo } from 'react';

interface TabNote {
    time: number;
    duration: number;
    string: number;
    fret: number;
    pitch: number;
}

interface TabVisualizerProps {
    data: TabNote[];
}

export const TabVisualizer: React.FC<TabVisualizerProps> = ({ data }) => {
    const ITEMS_PER_ROW = 16;

    const groupedColumns = useMemo(() => {
        const groups: { time: number; notes: TabNote[] }[] = [];

        const sortedData = [...data].sort((a, b) => a.time - b.time);

        sortedData.forEach(note => {
            const existingGroup = groups.find(g => Math.abs(g.time - note.time) < 0.01);

            if (existingGroup) {
                existingGroup.notes.push(note);
            } else {
                groups.push({ time: note.time, notes: [note] });
            }
        });

        return groups;
    }, [data]);

    const totalRows = Math.ceil(groupedColumns.length / ITEMS_PER_ROW);
    const stringLabels = ['e', 'B', 'G', 'D', 'A', 'E'];

    return (
        <div className="w-full bg-[#111827] rounded-xl shadow-2xl border border-slate-800 flex flex-col p-8 gap-12 select-none">

            <div className="border-b border-slate-700 pb-4 mb-2">
                <h2 className="text-2xl font-bold text-slate-200">Guitar Tablature</h2>
            </div>

            {Array.from({ length: totalRows }).map((_, rowIndex) => {

                const rowColumns = groupedColumns.slice(
                    rowIndex * ITEMS_PER_ROW,
                    (rowIndex + 1) * ITEMS_PER_ROW
                );

                return (
                    <div key={rowIndex} className="relative w-full mb-6">

                        <div className="relative w-full h-[160px]">

                            {stringLabels.map((label, strIndex) => (
                                <div
                                    key={strIndex}
                                    className="absolute w-full flex items-center"
                                    style={{ top: `${strIndex * 25 + 10}px` }}
                                >
                                    <div className="w-full h-[1px] bg-slate-600 opacity-30"></div>

                                    <span className="absolute -left-6 text-slate-500 font-mono text-sm font-bold w-4">
                                        {label}
                                    </span>

                                    <div className="absolute right-0 h-4 w-[2px] bg-slate-600"></div>
                                    <div className="absolute left-0 h-4 w-[2px] bg-slate-600"></div>
                                </div>
                            ))}

                            <div className="absolute inset-0 flex flex-row px-4 w-full h-full">
                                {rowColumns.map((column, colIndex) => (
                                    <div key={colIndex} className="flex-1 relative h-full">

                                        {column.notes.map((note, noteIndex) => {
                                            const visualStringIndex = note.string - 1;

                                            return (
                                                <div
                                                    key={noteIndex}
                                                    className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center font-mono font-bold text-lg z-10 hover:scale-125 cursor-default transition-transform"
                                                    style={{
                                                        top: `${visualStringIndex * 25 - 2}px`,
                                                        width: '28px',
                                                        height: '24px',
                                                    }}
                                                >
                                                    <div className="absolute inset-0 bg-[#111827] rounded-sm z-[-1]"></div>

                                                    <span className="text-cyan-400">
                                                        {note.fret}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}

                                {Array.from({ length: ITEMS_PER_ROW - rowColumns.length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="flex-1"></div>
                                ))}
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
};