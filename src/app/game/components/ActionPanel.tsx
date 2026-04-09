'use client';

import React, { useState } from 'react';
import { GameState, GameAction } from '../reducer';
import { HOUSES } from '../data/houses';
import { ALL_REGIONS } from '../data/territories';
import { Plus, Minus, Swords, ArrowRightLeft, CreditCard, Check, X } from 'lucide-react';

interface ActionPanelProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

function DeployControl({ territoryName, territoryId, max, dispatch }: {
  territoryName: string;
  territoryId: string;
  max: number;
  dispatch: React.Dispatch<GameAction>;
}) {
  const [amount, setAmount] = useState(1);
  const clamped = Math.max(1, Math.min(amount, max));

  return (
    <div className="bg-[#1a1510] rounded-lg border border-[#4a3828] p-3">
      <div className="text-xs text-gray-400 mb-2">Deploy to: <span className="text-white font-bold">{territoryName}</span></div>
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setAmount(a => Math.max(1, a - 1))}
          disabled={clamped <= 1}
          className="w-8 h-8 rounded bg-[#2a2018] border border-[#4a3828] text-white text-sm font-bold hover:bg-[#3a3028] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          min={1}
          max={max}
          value={clamped}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            setAmount(isNaN(v) ? 1 : Math.max(1, Math.min(v, max)));
          }}
          className="flex-1 bg-[#0a0805] border border-[#4a3828] rounded text-center text-white text-sm font-bold py-1.5 focus:outline-none focus:border-[#DAA520] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => setAmount(a => Math.min(max, a + 1))}
          disabled={clamped >= max}
          className="w-8 h-8 rounded bg-[#2a2018] border border-[#4a3828] text-white text-sm font-bold hover:bg-[#3a3028] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {max > 1 && (
        <input
          type="range"
          min={1}
          max={max}
          value={clamped}
          onChange={(e) => setAmount(parseInt(e.target.value, 10))}
          className="w-full h-1.5 mb-2 rounded-lg appearance-none cursor-pointer accent-[#DAA520] bg-[#2a2018]"
        />
      )}
      <div className="flex gap-2">
        <button
          onClick={() => { dispatch({ type: 'DEPLOY_ARMY', territoryId, count: clamped }); setAmount(1); }}
          className="flex-1 py-2 bg-[#2E7D32] text-white rounded border border-green-700 hover:bg-green-700 text-xs font-bold"
        >
          Deploy {clamped}
        </button>
        {max > 1 && (
          <button
            onClick={() => { dispatch({ type: 'DEPLOY_ARMY', territoryId, count: max }); setAmount(1); }}
            className="py-2 px-3 bg-[#2E7D32] text-white rounded border border-green-700 hover:bg-green-700 text-xs font-bold"
          >
            All ({max})
          </button>
        )}
      </div>
    </div>
  );
}

export default function ActionPanel({ state, dispatch }: ActionPanelProps) {
  const currentPlayer = state.players[state.currentPlayerIndex];
  const selectedTerritory = state.selectedTerritory ? state.territories[state.selectedTerritory] : null;
  const targetTerritory = state.targetTerritory ? state.territories[state.targetTerritory] : null;

  return (
    <div className="flex flex-col gap-3 p-3 h-full overflow-y-auto">
      {/* Phase Actions */}
      {state.currentPhase === 'reinforce' && (
        <div className="space-y-3">
          <div className="bg-[#1a1510] rounded-lg border border-[#4a3828] p-3">
            <h3 className="text-sm font-bold text-[#DAA520] mb-2 font-serif flex items-center gap-1">
              <Plus className="w-4 h-4" /> REINFORCE
            </h3>
            <div className="text-xs text-gray-400 space-y-1">
              {(() => {
                const ownedTerritories = Object.values(state.territories).filter(t => t.owner === currentPlayer.id);
                const castleCount = ownedTerritories.filter(t => t.hascastle).length;
                const base = Math.max(3, Math.floor((ownedTerritories.length + castleCount) / 3));

                const controlledRegions: string[] = [];
                for (const region of ALL_REGIONS) {
                  const ownsAll = region.territories.every(tid =>
                    state.territories[tid]?.owner === currentPlayer.id
                  );
                  if (ownsAll) {
                    controlledRegions.push(`${region.name} (+${region.bonus})`);
                  }
                }

                return (
                  <>
                    <div>Territories + Castles: {ownedTerritories.length} + {castleCount} = {ownedTerritories.length + castleCount} ÷ 3 = {base}</div>
                    {controlledRegions.map((r, i) => <div key={i} className="text-green-400">{r}</div>)}
                    <div className="font-bold text-white border-t border-gray-700 pt-1 mt-1">
                      Remaining to deploy: <span className="text-[#DAA520]">{state.reinforcementsRemaining}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Selected territory deployment */}
          {selectedTerritory && selectedTerritory.owner === currentPlayer.id && state.reinforcementsRemaining > 0 && (
            <DeployControl
              territoryName={selectedTerritory.name}
              territoryId={state.selectedTerritory!}
              max={state.reinforcementsRemaining}
              dispatch={dispatch}
            />
          )}

          {/* Card trade */}
          {currentPlayer.territoryCards.length >= 3 && (
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CARD_TRADE' })}
              className="w-full py-2 bg-purple-900/50 text-purple-300 rounded-lg border border-purple-700 hover:bg-purple-800 text-xs font-bold flex items-center justify-center gap-1"
            >
              <CreditCard className="w-3 h-3" /> Trade Cards ({currentPlayer.territoryCards.length})
            </button>
          )}

          <button
            onClick={() => dispatch({ type: 'FINISH_REINFORCE' })}
            disabled={state.reinforcementsRemaining > 0}
            className={`w-full py-2 rounded-lg text-xs font-bold ${
              state.reinforcementsRemaining > 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-[#DAA520] text-black hover:bg-yellow-500 border border-yellow-600'
            }`}
          >
            End Reinforce Phase →
          </button>
        </div>
      )}

      {state.currentPhase === 'invade' && !state.activeBattle && (
        <div className="space-y-3">
          <div className="bg-[#1a1510] rounded-lg border border-[#4a3828] p-3">
            <h3 className="text-sm font-bold text-red-400 mb-2 font-serif flex items-center gap-1">
              <Swords className="w-4 h-4" /> INVADE
            </h3>
            <p className="text-xs text-gray-400">
              {!state.selectedTerritory
                ? 'Select one of your territories to attack from.'
                : !state.targetTerritory
                  ? 'Select an adjacent enemy territory to attack.'
                  : 'Ready to attack!'}
            </p>
          </div>

          {selectedTerritory && (
            <div className="bg-[#1a1510] rounded-lg border border-[#4a3828] p-3">
              <div className="text-xs text-gray-400">From: <span className="text-white font-bold">{selectedTerritory.name}</span> ({selectedTerritory.armies} armies)</div>
              {targetTerritory && (
                <div className="text-xs text-gray-400 mt-1">To: <span className="text-red-400 font-bold">{targetTerritory.name}</span> ({targetTerritory.armies} armies)</div>
              )}
            </div>
          )}

          {selectedTerritory && targetTerritory && (
            <button
              onClick={() => dispatch({ type: 'INITIATE_ATTACK', from: state.selectedTerritory!, to: state.targetTerritory! })}
              className="w-full py-2 bg-red-900 text-red-200 rounded-lg border border-red-700 hover:bg-red-800 text-xs font-bold flex items-center justify-center gap-1"
            >
              <Swords className="w-3 h-3" /> Attack!
            </button>
          )}

          <button
            onClick={() => dispatch({ type: 'FINISH_INVADE' })}
            className="w-full py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700 text-xs font-bold"
          >
            End Invasion Phase →
          </button>
        </div>
      )}

      {state.currentPhase === 'maneuver' && (
        <div className="space-y-3">
          <div className="bg-[#1a1510] rounded-lg border border-[#4a3828] p-3">
            <h3 className="text-sm font-bold text-blue-400 mb-2 font-serif flex items-center gap-1">
              <ArrowRightLeft className="w-4 h-4" /> MANEUVER
            </h3>
            <p className="text-xs text-gray-400">
              {state.maneuverDone
                ? 'Maneuver complete.'
                : !state.selectedTerritory
                  ? 'Select one of your territories to move armies from.'
                  : !state.targetTerritory
                    ? 'Select a connected friendly territory to move to.'
                    : 'Set armies to move.'}
            </p>
          </div>

          {selectedTerritory && targetTerritory && !state.maneuverDone && (
            <div className="bg-[#1a1510] rounded-lg border border-[#4a3828] p-3 space-y-2">
              <div className="text-xs text-gray-400">
                From: <span className="text-white">{selectedTerritory.name}</span> ({selectedTerritory.armies}) →
                To: <span className="text-blue-300">{targetTerritory.name}</span> ({targetTerritory.armies})
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: 'SET_MOVE_COUNT', count: Math.max(1, state.moveArmyCount - 1) })}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <Minus className="w-3 h-3 text-white" />
                </button>
                <span className="text-white font-bold text-sm min-w-[24px] text-center">{state.moveArmyCount}</span>
                <button
                  onClick={() => dispatch({ type: 'SET_MOVE_COUNT', count: Math.min(selectedTerritory.armies - 1, state.moveArmyCount + 1) })}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
                <button
                  onClick={() => dispatch({
                    type: 'MANEUVER',
                    from: state.selectedTerritory!,
                    to: state.targetTerritory!,
                    armies: state.moveArmyCount,
                  })}
                  className="ml-auto py-1 px-3 bg-blue-800 text-blue-200 rounded text-xs font-bold hover:bg-blue-700 border border-blue-600"
                >
                  Move
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => dispatch({ type: 'FINISH_MANEUVER' })}
            className="w-full py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700 text-xs font-bold"
          >
            End Maneuver Phase →
          </button>
        </div>
      )}

      {state.currentPhase === 'draw' && (
        <div className="space-y-3">
          <div className="bg-[#1a1510] rounded-lg border border-[#4a3828] p-3">
            <h3 className="text-sm font-bold text-purple-400 mb-2 font-serif flex items-center gap-1">
              <CreditCard className="w-4 h-4" /> DRAW
            </h3>
            <p className="text-xs text-gray-400">
              {currentPlayer.conqueredThisTurn
                ? 'You conquered a territory this turn. Draw a card!'
                : 'No territory conquered — no card to draw.'}
            </p>
          </div>

          {currentPlayer.conqueredThisTurn && (
            <button
              onClick={() => dispatch({ type: 'DRAW_CARD' })}
              className="w-full py-2 bg-purple-900 text-purple-200 rounded-lg border border-purple-700 hover:bg-purple-800 text-xs font-bold"
            >
              Draw Territory Card
            </button>
          )}

          <button
            onClick={() => dispatch({ type: 'END_TURN' })}
            className="w-full py-2 bg-[#DAA520] text-black rounded-lg hover:bg-yellow-500 text-xs font-bold"
          >
            End Turn →
          </button>
        </div>
      )}

      {/* Selected territory info */}
      {selectedTerritory && (
        <div className="bg-[#1a1510] rounded-lg border border-[#4a3828] p-3 mt-auto">
          <div className="text-xs text-gray-500 mb-1">Selected Territory</div>
          <div className="text-sm font-bold text-[#DAA520] font-serif">{selectedTerritory.name}</div>
          <div className="text-xs text-gray-400 mt-1">
            Owner: {selectedTerritory.owner ? HOUSES[selectedTerritory.owner]?.name || 'Unknown' : 'Neutral'}
          </div>
          <div className="text-xs text-gray-400">Armies: {selectedTerritory.armies}</div>
          {selectedTerritory.hascastle && <div className="text-xs text-yellow-600">🏰 Castle</div>}
          {selectedTerritory.hasport && <div className="text-xs text-blue-400">⚓ Port ({selectedTerritory.portColor})</div>}
          <div className="text-xs text-gray-500 mt-1">
            Adjacent: {selectedTerritory.adjacentTerritories.map(id => state.territories[id]?.name || id).join(', ')}
          </div>
          <button
            onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
            className="mt-2 text-xs text-gray-500 underline hover:text-gray-300"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Card Trade Modal */}
      {state.showCardTradePanel && (
        <div className="bg-[#1a1510] rounded-lg border border-purple-700 p-3">
          <div className="text-sm font-bold text-purple-400 mb-2">Trade Cards</div>
          <div className="space-y-1">
            {currentPlayer.territoryCards.map(card => {
              const isSelected = state.selectedCards.includes(card.id);
              const iconMap: Record<string, string> = { infantry: '🐎', cavalry: '⚔️', siege: '⚙️', wild: '🃏' };
              return (
                <div
                  key={card.id}
                  onClick={() => dispatch({ type: 'SELECT_CARD', cardId: card.id })}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer text-xs ${
                    isSelected ? 'bg-purple-900 border border-purple-500' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <span>{iconMap[card.type]}</span>
                  <span className="text-gray-300">{state.territories[card.territoryId]?.name || card.territoryId}</span>
                  {isSelected && <Check className="w-3 h-3 text-purple-400 ml-auto" />}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => dispatch({ type: 'TRADE_CARDS' })}
              disabled={state.selectedCards.length !== 3}
              className={`flex-1 py-1 rounded text-xs font-bold ${
                state.selectedCards.length === 3
                  ? 'bg-purple-700 text-white hover:bg-purple-600'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Trade Set
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CARD_TRADE' })}
              className="py-1 px-2 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
