'use client';

import React from 'react';
import { ScrollText } from 'lucide-react';

interface GameLogProps {
  log: string[];
}

export default function GameLog({ log }: GameLogProps) {
  const logRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log.length]);

  return (
    <div className="bg-[#0a0805] border-t border-[#2a2520]">
      <div className="flex items-center gap-1 px-3 py-1 border-b border-[#2a2520]">
        <ScrollText className="w-3 h-3 text-gray-600" />
        <span className="text-[10px] text-gray-600 font-bold tracking-wider">BATTLE LOG</span>
      </div>
      <div
        ref={logRef}
        className="h-20 overflow-y-auto px-3 py-1 space-y-0.5"
      >
        {log.map((entry, i) => (
          <div key={i} className="text-[11px] text-gray-500 leading-tight">
            <span className="text-gray-700 mr-1">{i + 1}.</span> {entry}
          </div>
        ))}
        {log.length === 0 && (
          <div className="text-[11px] text-gray-700 italic">No events yet...</div>
        )}
      </div>
    </div>
  );
}
