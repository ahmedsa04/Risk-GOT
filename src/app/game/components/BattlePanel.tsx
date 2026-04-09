'use client';

import React, { useState, useEffect } from 'react';
import { BattleState, GameState } from '../reducer';
import { HOUSES } from '../data/houses';
import { Swords, Dice1 } from 'lucide-react';

interface BattlePanelProps {
  battle: BattleState;
  state: GameState;
  attackArmyCount: number;
  onSetAttackArmies: (count: number) => void;
  onRollDice: () => void;
  onContinue: () => void;
  onEndInvasion: () => void;
}

function DiceFace({ value, color, size = 48 }: { value: number; color: string; size?: number }) {
  const [rolling, setRolling] = useState(true);
  const [displayValue, setDisplayValue] = useState(1);

  useEffect(() => {
    if (rolling) {
      let frame = 0;
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        frame++;
        if (frame > 8) {
          clearInterval(interval);
          setRolling(false);
          setDisplayValue(value);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [value, rolling]);

  const dotPositions: Record<number, Array<[number, number]>> = {
    1: [[0.5, 0.5]],
    2: [[0.25, 0.25], [0.75, 0.75]],
    3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
    5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
    6: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.5], [0.75, 0.5], [0.25, 0.75], [0.75, 0.75]],
  };

  const dots = dotPositions[displayValue] || [];

  return (
    <div
      className={`relative rounded-lg border-2 flex items-center justify-center ${rolling ? 'animate-bounce' : ''}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color === 'red' ? '#8B0000' : color === 'black' ? '#1a1a1a' : '#333',
        borderColor: color === 'red' ? '#cc3333' : '#555',
      }}
    >
      <svg width={size - 8} height={size - 8} viewBox="0 0 1 1">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.1" fill="white" />
        ))}
      </svg>
    </div>
  );
}

export default function BattlePanel({
  battle,
  state,
  attackArmyCount,
  onSetAttackArmies,
  onRollDice,
  onContinue,
  onEndInvasion,
}: BattlePanelProps) {
  const attacker = state.territories[battle.attackerTerritory];
  const defender = state.territories[battle.defenderTerritory];
  if (!attacker || !defender) return null;

  const attackerHouse = HOUSES[battle.attackerHouse];
  const defenderHouse = battle.defenderHouse !== 'neutral' ? HOUSES[battle.defenderHouse] : null;
  const maxAttack = Math.min(3, attacker.armies - 1);
  const defenderDiceCount = Math.min(2, defender.armies);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1510] border-2 border-[#DAA520] rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
        style={{ boxShadow: '0 0 40px rgba(218,165,32,0.2)' }}>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-[#DAA520] font-serif text-lg font-bold mb-1">
            <Swords className="w-5 h-5" />
            BATTLE
          </div>
          <div className="text-sm text-gray-400">
            {attacker.name} → {defender.name}
          </div>
        </div>

        {/* Combatants */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="text-center">
            <div className="text-xl mb-1">{attackerHouse?.sigil}</div>
            <div className="text-sm font-bold" style={{ color: attackerHouse?.color }}>
              {attackerHouse?.name || 'Attacker'}
            </div>
            <div className="text-xs text-gray-400">{attacker.armies} armies</div>
          </div>
          <div className="text-2xl text-[#DAA520] font-bold">⚔️</div>
          <div className="text-center">
            <div className="text-xl mb-1">{defenderHouse?.sigil || '🏴'}</div>
            <div className="text-sm font-bold" style={{ color: defenderHouse?.color || '#888' }}>
              {defenderHouse?.name || 'Neutral'}
            </div>
            <div className="text-xs text-gray-400">{defender.armies} armies</div>
          </div>
        </div>

        {/* Army selection (before rolling) */}
        {!battle.resolved && battle.attackDice.length === 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2 text-center">Select attacking armies:</div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  disabled={n > maxAttack}
                  onClick={() => onSetAttackArmies(n)}
                  className={`w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all ${
                    n === attackArmyCount
                      ? 'border-[#DAA520] bg-[#DAA520]/20 text-[#DAA520]'
                      : n > maxAttack
                        ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                        : 'border-gray-600 text-gray-300 hover:border-gray-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-gray-500 text-center mt-1">
              Defender will roll {defenderDiceCount} {defenderDiceCount === 1 ? 'die' : 'dice'}
            </div>

            <button
              onClick={onRollDice}
              className="w-full mt-4 py-3 bg-gradient-to-r from-red-900 to-red-700 text-white font-bold rounded-lg border border-red-600 hover:from-red-800 hover:to-red-600 transition-all flex items-center justify-center gap-2"
            >
              <Dice1 className="w-5 h-5" />
              ROLL DICE
            </button>
          </div>
        )}

        {/* Dice results */}
        {battle.attackDice.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between mb-3 px-4">
              <div>
                <div className="text-xs text-red-400 mb-1 font-bold">ATTACK</div>
                <div className="flex gap-2">
                  {battle.attackDice.map((d, i) => (
                    <DiceFace key={i} value={d} color="red" size={42} />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-300 mb-1 font-bold">DEFENSE</div>
                <div className="flex gap-2">
                  {battle.defenseDice.map((d, i) => (
                    <DiceFace key={i} value={d} color="black" size={42} />
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-[#0a0a0a] rounded-lg p-3 mb-3">
              {(() => {
                const pairs = Math.min(battle.attackDice.length, battle.defenseDice.length);
                const results = [];
                for (let i = 0; i < pairs; i++) {
                  const atkWins = battle.attackDice[i] > battle.defenseDice[i];
                  results.push(
                    <div key={i} className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-400">Pair {i + 1}: {battle.attackDice[i]} vs {battle.defenseDice[i]}</span>
                      <span className={atkWins ? 'text-green-400' : 'text-red-400'}>
                        {atkWins
                          ? `${defenderHouse?.name || 'Defender'} -1`
                          : `${attackerHouse?.name || 'Attacker'} -1`
                        }
                      </span>
                    </div>
                  );
                }
                return results;
              })()}
            </div>

            {battle.conqueredThisBattle && (
              <div className="text-center py-2 bg-green-900/30 rounded-lg border border-green-700 mb-3">
                <span className="text-green-400 font-bold text-sm">🏆 Territory Conquered!</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              {!battle.conqueredThisBattle && attacker.armies > 1 && defender.armies > 0 && (
                <button
                  onClick={onContinue}
                  className="flex-1 py-2 bg-red-900/80 text-red-200 rounded-lg border border-red-700 hover:bg-red-800 transition-all text-sm font-bold"
                >
                  Continue Battle
                </button>
              )}
              <button
                onClick={onEndInvasion}
                className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700 transition-all text-sm font-bold"
              >
                End Invasion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
