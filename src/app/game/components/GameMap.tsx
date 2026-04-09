'use client';

import React from 'react';
import { Territory } from '../data/territories';
import { HOUSES } from '../data/houses';
import WesterosMap from './WesterosMap';
import EssosMap from './EssosMap';

interface GameMapProps {
  territories: Record<string, Territory>;
  selectedTerritory: string | null;
  targetTerritory: string | null;
  hoveredTerritory: string | null;
  currentPlayerId: string;
  currentPhase: string;
  mapFilter: 'westeros' | 'essos' | 'both';
  onTerritoryClick: (id: string) => void;
  onTerritoryHover: (id: string | null) => void;
}

function getTerritoryFill(territory: Territory, selected: boolean, target: boolean, hovered: boolean): string | null {
  if (!territory.owner) return hovered ? 'rgba(100,100,100,0.5)' : null;

  const house = HOUSES[territory.owner];
  if (!house) return null;

  const baseColor = house.color;

  if (selected) return '#FFD700';
  if (target) return '#FF4444';
  if (hovered) return lightenColor(baseColor, 30);
  return baseColor;
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

function renderOverlays(territoryList: Territory[], selectedTerritory: string | null, targetTerritory: string | null, onTerritoryClick: (id: string) => void, onTerritoryHover: (id: string | null) => void) {
  return (
    <>
      {territoryList.map(territory => (
        <React.Fragment key={territory.id}>
          {/* Army count badge */}
          {territory.armies > 0 && (
            <g
              onClick={() => onTerritoryClick(territory.id)}
              className="cursor-pointer"
              onMouseEnter={() => onTerritoryHover(territory.id)}
              onMouseLeave={() => onTerritoryHover(null)}
            >
              <circle cx={territory.cx} cy={territory.cy} r="10" fill="#111" fillOpacity="0.85" stroke={territory.owner ? HOUSES[territory.owner]?.color || '#666' : '#666'} strokeWidth="1.5" />
              <text x={territory.cx} y={territory.cy + 3.5} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
                {territory.armies}
              </text>
            </g>
          )}

          {/* Castle icon */}
          {territory.hascastle && (
            <text x={territory.cx + 12} y={territory.cy - 6} fontSize="7" fill="#DAA520" opacity="0.9">🏰</text>
          )}

          {/* Port icon */}
          {territory.hasport && (
            <text x={territory.cx - 16} y={territory.cy - 6} fontSize="7" fill="#4aa8ff" opacity="0.9">⚓</text>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

export default function GameMap({
  territories,
  selectedTerritory,
  targetTerritory,
  hoveredTerritory,
  currentPlayerId: _currentPlayerId,
  currentPhase: _currentPhase,
  mapFilter,
  onTerritoryClick,
  onTerritoryHover,
}: GameMapProps) {
  const territoryList = Object.values(territories);
  const westerosTerritories = territoryList.filter(t => t.map === 'westeros');
  const essosTerritories = territoryList.filter(t => t.map === 'essos');

  const showWesteros = mapFilter === 'westeros' || mapFilter === 'both';

  // Build territory fill and stroke maps
  const buildMaps = (terrList: Territory[]) => {
    const fills: Record<string, string> = {};
    const strokes: Record<string, { color: string; width: number }> = {};

    terrList.forEach(t => {
      const isSelected = selectedTerritory === t.id;
      const isTarget = targetTerritory === t.id;
      const isHovered = hoveredTerritory === t.id;
      const fill = getTerritoryFill(t, isSelected, isTarget, isHovered);
      if (fill) fills[t.id] = fill;

      if (isSelected) {
        strokes[t.id] = { color: '#FFD700', width: 2.5 };
      } else if (isTarget) {
        strokes[t.id] = { color: '#FF4444', width: 2.5 };
      }
    });

    return { fills, strokes };
  };

  const wMaps = buildMaps(westerosTerritories);
  const eMaps = buildMaps(essosTerritories);

  if (mapFilter === 'both') {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-auto">
        <div className="flex gap-2 items-start p-4 max-h-[calc(100vh-200px)]">
          <div className="flex-shrink-0" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <WesterosMap
              territoryFills={wMaps.fills}
              territoryStrokes={wMaps.strokes}
              selectedTerritory={selectedTerritory}
              onTerritoryClick={onTerritoryClick}
              onTerritoryHover={onTerritoryHover}
              overlays={renderOverlays(westerosTerritories, selectedTerritory, targetTerritory, onTerritoryClick, onTerritoryHover)}
            />
          </div>
          <div className="flex-shrink-0" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <EssosMap
              territoryFills={eMaps.fills}
              territoryStrokes={eMaps.strokes}
              selectedTerritory={selectedTerritory}
              onTerritoryClick={onTerritoryClick}
              onTerritoryHover={onTerritoryHover}
              overlays={renderOverlays(essosTerritories, selectedTerritory, targetTerritory, onTerritoryClick, onTerritoryHover)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showWesteros) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-auto p-4">
        <WesterosMap
          territoryFills={wMaps.fills}
          territoryStrokes={wMaps.strokes}
          selectedTerritory={selectedTerritory}
          onTerritoryClick={onTerritoryClick}
          onTerritoryHover={onTerritoryHover}
          overlays={renderOverlays(westerosTerritories, selectedTerritory, targetTerritory, onTerritoryClick, onTerritoryHover)}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-auto p-4">
      <EssosMap
        territoryFills={eMaps.fills}
        territoryStrokes={eMaps.strokes}
        selectedTerritory={selectedTerritory}
        onTerritoryClick={onTerritoryClick}
        onTerritoryHover={onTerritoryHover}
        overlays={renderOverlays(essosTerritories, selectedTerritory, targetTerritory, onTerritoryClick, onTerritoryHover)}
      />
    </div>
  );
}
