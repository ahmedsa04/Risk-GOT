'use client';

import React from 'react';
import { GameState } from '../reducer';
import { HOUSES } from '../data/houses';
import { Trophy, MapPin, Castle, Anchor, Star } from 'lucide-react';

interface GameOverScreenProps {
  state: GameState;
  onRestart: () => void;
}

export default function GameOverScreen({ state, onRestart }: GameOverScreenProps) {
  const territories = Object.values(state.territories);

  const scores = state.players
    .filter(p => !p.eliminated)
    .map(player => {
      const owned = territories.filter(t => t.owner === player.id);
      const castles = owned.filter(t => t.hascastle).length;
      const ports = owned.filter(t => t.hasport).length;
      const total = owned.length + castles + ports;
      return {
        ...player,
        territoryCount: owned.length,
        castleCount: castles,
        portCount: ports,
        total,
      };
    })
    .sort((a, b) => b.total - a.total);

  const winner = state.winner ? HOUSES[state.winner] : scores[0] ? HOUSES[scores[0].id] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="bg-[#1a1510] border-2 border-[#DAA520] rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 text-center"
        style={{ boxShadow: '0 0 60px rgba(218,165,32,0.3)' }}>

        <Trophy className="w-16 h-16 text-[#DAA520] mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-[#DAA520] font-serif mb-2">VICTORY</h1>

        {winner && (
          <div className="mb-6">
            <div className="text-4xl mb-2">{winner.sigil}</div>
            <div className="text-2xl font-bold font-serif" style={{ color: winner.color }}>
              {winner.name}
            </div>
            <div className="text-gray-400 text-sm mt-1">has conquered the realm!</div>
          </div>
        )}

        {/* Score table */}
        <div className="bg-[#0a0a0a] rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-gray-800">
                <th className="py-2 px-3 text-left">House</th>
                <th className="py-2 px-2 text-center"><MapPin className="w-3 h-3 inline" /></th>
                <th className="py-2 px-2 text-center"><Castle className="w-3 h-3 inline" /></th>
                <th className="py-2 px-2 text-center"><Anchor className="w-3 h-3 inline" /></th>
                {(state.mode === 'dominion' || state.mode === 'world_at_war') && (
                  <th className="py-2 px-2 text-center"><Star className="w-3 h-3 inline" /></th>
                )}
                <th className="py-2 px-2 text-center font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((player, idx) => (
                <tr key={player.id} className={idx === 0 ? 'bg-[#DAA520]/10' : ''}>
                  <td className="py-2 px-3 text-left font-bold" style={{ color: player.color }}>
                    {player.sigil} {player.name}
                  </td>
                  <td className="py-2 px-2 text-center text-gray-300">{player.territoryCount}</td>
                  <td className="py-2 px-2 text-center text-gray-300">{player.castleCount}</td>
                  <td className="py-2 px-2 text-center text-gray-300">{player.portCount}</td>
                  {(state.mode === 'dominion' || state.mode === 'world_at_war') && (
                    <td className="py-2 px-2 text-center text-yellow-400">{player.victoryPoints}</td>
                  )}
                  <td className="py-2 px-2 text-center text-white font-bold">{player.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all text-sm"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
