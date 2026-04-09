'use client';

import React from 'react';
import { GameMode, GameAction } from '../reducer';
import { Swords, Crown, Globe, Shield, Dices } from 'lucide-react';
import { HOUSES, getHousesForPlayerCount } from '../data/houses';

interface SetupScreenProps {
  setupStep: string;
  mode: GameMode;
  playerCount: number;
  dispatch: React.Dispatch<GameAction>;
}

export default function SetupScreen({ setupStep, mode, playerCount, dispatch }: SetupScreenProps) {
  if (setupStep === 'mode_select') {
    return (
      <div className="min-h-screen bg-[#0a0805] flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">⚔️</div>
            <h1 className="text-5xl font-bold text-[#DAA520] font-serif tracking-wider mb-2"
              style={{ textShadow: '0 0 30px rgba(218,165,32,0.3)' }}>
              RISK
            </h1>
            <h2 className="text-xl text-gray-400 font-serif tracking-widest">GAME OF THRONES</h2>
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent mx-auto mt-4" />
          </div>

          {/* Mode cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Skirmish */}
            <button
              onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'skirmish' })}
              className="group bg-[#1a1510] border-2 border-[#4a3828] hover:border-[#DAA520] rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/20"
            >
              <Swords className="w-12 h-12 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-[#DAA520] font-serif mb-2">SKIRMISH</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Classic Risk rules. Fast-paced battles. No gold, no characters, no objectives.
                3–5 players on Westeros, 2 on Essos.
              </p>
              <div className="mt-4 text-[10px] text-gray-600 font-bold tracking-wider">2–5 PLAYERS</div>
            </button>

            {/* Dominion */}
            <button
              onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'dominion' })}
              className="group bg-[#1a1510] border-2 border-[#4a3828] hover:border-[#DAA520] rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/20"
            >
              <Crown className="w-12 h-12 text-[#DAA520] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-[#DAA520] font-serif mb-2">DOMINION</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Full rules with Gold, Character Cards, Maester Cards, Objectives, and Victory Points.
              </p>
              <div className="mt-4 text-[10px] text-gray-600 font-bold tracking-wider">2–5 PLAYERS</div>
            </button>

            {/* World at War */}
            <button
              onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'world_at_war', subMode: 'skirmish' })}
              className="group bg-[#1a1510] border-2 border-[#4a3828] hover:border-[#DAA520] rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/20"
            >
              <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-[#DAA520] font-serif mb-2">WORLD AT WAR</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Both maps! Westeros and Essos side by side. Ports connect across the Narrow Sea.
              </p>
              <div className="mt-4 text-[10px] text-gray-600 font-bold tracking-wider">6–7 PLAYERS</div>
            </button>
          </div>

          <div className="text-center mt-8 text-xs text-gray-600">
            &quot;When you play the game of thrones, you win or you die.&quot;
          </div>
        </div>
      </div>
    );
  }

  if (setupStep === 'player_setup') {
    const minPlayers = mode === 'world_at_war' ? 6 : 2;
    const maxPlayers = mode === 'world_at_war' ? 7 : 5;
    const houses = getHousesForPlayerCount(playerCount, mode);

    return (
      <div className="min-h-screen bg-[#0a0805] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#DAA520] font-serif mb-2">CHOOSE YOUR PLAYERS</h1>
            <div className="text-sm text-gray-400 capitalize">{mode.replace(/_/g, ' ')} Mode</div>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent mx-auto mt-3" />
          </div>

          {/* Player count */}
          <div className="bg-[#1a1510] border border-[#4a3828] rounded-xl p-6 mb-6">
            <div className="text-sm text-gray-400 mb-3 text-center">Number of Houses</div>
            <div className="flex justify-center gap-3">
              {Array.from({ length: maxPlayers - minPlayers + 1 }, (_, i) => i + minPlayers).map(n => (
                <button
                  key={n}
                  onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: n })}
                  className={`w-14 h-14 rounded-xl border-2 text-xl font-bold transition-all ${
                    n === playerCount
                      ? 'border-[#DAA520] bg-[#DAA520]/20 text-[#DAA520] shadow-lg shadow-yellow-900/30'
                      : 'border-[#4a3828] text-gray-500 hover:border-gray-500'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* House preview */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {houses.map((hid, idx) => {
              const house = HOUSES[hid];
              return (
                <div
                  key={hid}
                  className="bg-[#1a1510] border border-[#4a3828] rounded-lg p-4 text-center"
                >
                  <div className="text-3xl mb-2">{house.sigil}</div>
                  <div className="text-sm font-bold font-serif" style={{ color: house.color }}>
                    {house.name}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Player {idx + 1} • {house.map}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-0.5">
                    Seat: {house.seat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => dispatch({ type: 'ASSIGN_HOUSES' })}
            className="w-full py-4 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-black font-bold rounded-xl text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all flex items-center justify-center gap-2"
          >
            <Dices className="w-5 h-5" />
            Assign Houses & Start
          </button>

          <button
            onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'skirmish' })}
            className="w-full mt-3 py-2 text-gray-500 hover:text-gray-300 text-sm transition-all"
            // This is a hack to go back - just re-triggers setup
          >
            ← Back to mode selection
          </button>
        </div>
      </div>
    );
  }

  if (setupStep === 'ready') {
    return (
      <div className="min-h-screen bg-[#0a0805] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Shield className="w-16 h-16 text-[#DAA520] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#DAA520] font-serif mb-4">ALL HOUSES READY</h1>
          <p className="text-gray-400 text-sm mb-6">
            Territories have been assigned. The war for the throne begins!
          </p>
          <button
            onClick={() => dispatch({ type: 'START_GAME' })}
            className="w-full py-4 bg-gradient-to-r from-red-800 to-red-600 text-white font-bold rounded-xl text-lg hover:from-red-700 hover:to-red-500 transition-all"
            style={{ boxShadow: '0 0 30px rgba(200,0,0,0.3)' }}
          >
            ⚔️ BEGIN THE WAR
          </button>
        </div>
      </div>
    );
  }

  return null;
}
