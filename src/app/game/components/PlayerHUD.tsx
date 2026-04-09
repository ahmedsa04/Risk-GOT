'use client';

import React from 'react';
import { Player } from '../reducer';
import { HOUSES } from '../data/houses';
import { Swords, MapPin, Castle, Anchor, Coins, Star, CreditCard } from 'lucide-react';

interface PlayerHUDProps {
  players: Player[];
  currentPlayerIndex: number;
  territories: Record<string, { owner: string | null; hascastle: boolean; hasport: boolean }>;
  mode: string;
}

export default function PlayerHUD({ players, currentPlayerIndex, territories, mode }: PlayerHUDProps) {
  const terrList = Object.values(territories);

  return (
    <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-full">
      {players.map((player, idx) => {
        const isActive = idx === currentPlayerIndex;
        const ownedTerritories = terrList.filter(t => t.owner === player.id);
        const castles = ownedTerritories.filter(t => t.hascastle).length;
        const ports = ownedTerritories.filter(t => t.hasport).length;

        return (
          <div
            key={player.id}
            className={`rounded-lg border px-3 py-2 transition-all duration-300 ${
              player.eliminated
                ? 'opacity-40 border-gray-700 bg-gray-900'
                : isActive
                  ? 'border-[#DAA520] bg-[#1a1510] shadow-lg shadow-yellow-900/20'
                  : 'border-[#2a2520] bg-[#111]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{player.sigil}</span>
              <span
                className="font-serif font-bold text-sm truncate"
                style={{ color: isActive ? '#DAA520' : player.color }}
              >
                {player.name}
              </span>
              {isActive && !player.eliminated && (
                <span className="ml-auto text-[10px] bg-[#DAA520] text-black px-1.5 py-0.5 rounded font-bold">
                  TURN
                </span>
              )}
              {player.eliminated && (
                <span className="ml-auto text-[10px] bg-red-900 text-red-300 px-1.5 py-0.5 rounded font-bold">
                  OUT
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 text-[10px] text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span>{ownedTerritories.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Castle className="w-3 h-3 text-yellow-700" />
                <span>{castles}</span>
              </div>
              <div className="flex items-center gap-1">
                <Anchor className="w-3 h-3 text-blue-500" />
                <span>{ports}</span>
              </div>
              <div className="flex items-center gap-1">
                <Swords className="w-3 h-3 text-gray-500" />
                <span>{player.armies.onBoard}</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-gray-500" />
                <span>{player.territoryCards.length}</span>
              </div>
              {(mode === 'dominion' || mode === 'world_at_war') && (
                <>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-500" />
                    <span>{player.gold}</span>
                  </div>
                </>
              )}
            </div>

            {(mode === 'dominion' || mode === 'world_at_war') && (
              <div className="mt-1 flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{player.victoryPoints} VP</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
