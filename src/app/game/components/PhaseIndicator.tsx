'use client';

import React from 'react';
import { GamePhase } from '../reducer';
import { Check, Circle, Dot } from 'lucide-react';

interface PhaseIndicatorProps {
  currentPhase: GamePhase;
  mode: string;
}

const SKIRMISH_PHASES: { id: GamePhase; label: string }[] = [
  { id: 'reinforce', label: 'REINFORCE' },
  { id: 'invade', label: 'INVADE' },
  { id: 'maneuver', label: 'MANEUVER' },
  { id: 'draw', label: 'DRAW' },
];

const DOMINION_PHASES: { id: GamePhase; label: string }[] = [
  { id: 'reinforce', label: 'REINFORCE' },
  { id: 'purchase', label: 'PURCHASE' },
  { id: 'refresh', label: 'REFRESH' },
  { id: 'invade', label: 'INVADE' },
  { id: 'maneuver', label: 'MANEUVER' },
  { id: 'objective', label: 'OBJECTIVE' },
  { id: 'draw', label: 'DRAW' },
];

export default function PhaseIndicator({ currentPhase, mode }: PhaseIndicatorProps) {
  const phases = mode === 'dominion' ? DOMINION_PHASES : SKIRMISH_PHASES;
  const currentIdx = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {phases.map((phase, idx) => {
        const isComplete = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isPending = idx > currentIdx;

        return (
          <React.Fragment key={phase.id}>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap transition-all ${
                isComplete
                  ? 'bg-green-900/50 text-green-400 border border-green-800'
                  : isCurrent
                    ? 'bg-[#DAA520]/20 text-[#DAA520] border border-[#DAA520]'
                    : 'bg-gray-800/50 text-gray-600 border border-gray-700'
              }`}
            >
              {isComplete && <Check className="w-3 h-3" />}
              {isCurrent && <Dot className="w-3 h-3" />}
              {isPending && <Circle className="w-2 h-2" />}
              {phase.label}
            </div>
            {idx < phases.length - 1 && (
              <span className={`text-xs ${isComplete ? 'text-green-700' : 'text-gray-700'}`}>→</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
