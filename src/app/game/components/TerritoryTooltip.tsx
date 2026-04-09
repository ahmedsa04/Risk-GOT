'use client';

import React from 'react';
import { Territory } from '../data/territories';
import { HOUSES } from '../data/houses';
import { Castle, Anchor, Swords, Shield, Crown } from 'lucide-react';

interface TerritoryTooltipProps {
  territory: Territory;
  position: { x: number; y: number } | null;
}

export default function TerritoryTooltip({ territory, position }: TerritoryTooltipProps) {
  if (!position) return null;

  const house = territory.owner ? HOUSES[territory.owner] : null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: Math.min(position.x + 16, window.innerWidth - 260),
        top: Math.min(position.y - 10, window.innerHeight - 200),
      }}
    >
      <div className="bg-[#1a1510] border border-[#4a3828] rounded-lg shadow-2xl px-4 py-3 min-w-[220px]"
        style={{ boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center gap-2 mb-2">
          {territory.hasSeatOfPower && <Crown className="w-4 h-4 text-yellow-500" />}
          <span className="font-bold text-[#DAA520] text-sm font-serif">{territory.name}</span>
        </div>

        {house && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs" style={{ color: house.color }}>{house.sigil}</span>
            <span className="text-xs" style={{ color: house.color }}>{house.name}</span>
          </div>
        )}

        {!house && territory.isNeutral && (
          <div className="text-xs text-gray-400 mb-1">Neutral Territory</div>
        )}

        <div className="text-xs text-gray-400 mb-2">
          Region: {territory.region.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-300">
          <div className="flex items-center gap-1">
            <Swords className="w-3 h-3" />
            <span>{territory.armies}</span>
          </div>
          {territory.hascastle && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Castle className="w-3 h-3" />
              <span>Castle</span>
            </div>
          )}
          {territory.hasport && (
            <div className="flex items-center gap-1 text-blue-400">
              <Anchor className="w-3 h-3" />
              <span>Port ({territory.portColor})</span>
            </div>
          )}
        </div>

        {territory.specialUnits.length > 0 && (
          <div className="mt-2 flex gap-2 text-xs text-gray-300">
            {territory.specialUnits.map((u, i) => (
              <div key={i} className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-400" />
                <span>{u}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
