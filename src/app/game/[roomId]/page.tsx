'use client';

import React, { useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGameRoom } from '../hooks/useGameRoom';
import LobbyScreen from '../components/LobbyScreen';
import GameMap from '../components/GameMap';
import PlayerHUD from '../components/PlayerHUD';
import ActionPanel from '../components/ActionPanel';
import BattlePanel from '../components/BattlePanel';
import PhaseIndicator from '../components/PhaseIndicator';
import GameOverScreen from '../components/GameOverScreen';
import GameLog from '../components/GameLog';
import TerritoryTooltip from '../components/TerritoryTooltip';
import { HOUSES } from '../data/houses';
import { Eye, EyeOff, Map } from 'lucide-react';

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const {
    hydrated,
    isConnected,
    myPlayerId,
    error,
    lobby,
    joinRoom,
    selectHouse,
    setStartingMethod,
    setMode,
    startGame,
    gameState,
    dispatch,
    isMyTurn,
  } = useGameRoom(roomId);

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [showNames, setShowNames] = useState(true);
  const [showRegions, setShowRegions] = useState(false);
  const [nickname, setNickname] = useState('');
  const [joining, setJoining] = useState(false);

  const handleTerritoryClick = useCallback((id: string) => {
    if (!isMyTurn) return;
    dispatch({ type: 'SELECT_TERRITORY', territoryId: id });
  }, [dispatch, isMyTurn]);

  const handleTerritoryHover = useCallback((id: string | null) => {
    dispatch({ type: 'HOVER_TERRITORY', territoryId: id });
  }, [dispatch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setJoining(true);
    await joinRoom(nickname.trim());
    setJoining(false);
  };

  // Wait for client hydration before deciding which view to show
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0a0805] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚔️</div>
          <div className="text-[#DAA520] font-serif">Loading...</div>
        </div>
      </div>
    );
  }

  // Join screen - show when no playerId yet
  if (!myPlayerId) {
    return (
      <div className="min-h-screen bg-[#0a0805] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">⚔️</div>
            <h1 className="text-3xl font-bold text-[#DAA520] font-serif tracking-wider mb-1"
              style={{ textShadow: '0 0 30px rgba(218,165,32,0.3)' }}>
              JOIN THE WAR
            </h1>
            <div className="text-sm text-gray-500 mt-2">Room: <span className="text-[#DAA520] font-mono">{roomId}</span></div>
          </div>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your nickname..."
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={20}
              autoFocus
              className="w-full bg-[#1a1510] border border-[#4a3828] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#DAA520] transition-colors"
            />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={!nickname.trim() || joining}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-black font-bold font-serif hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {joining ? 'Joining...' : 'Enter the Realm'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Lobby screen - show when connected but game hasn't started
  if (!gameState && lobby) {
    return (
      <LobbyScreen
        roomId={roomId}
        lobby={lobby}
        myPlayerId={myPlayerId}
        isConnected={isConnected}
        error={error}
        onSelectHouse={selectHouse}
        onSetStartingMethod={setStartingMethod}
        onSetMode={setMode}
        onStartGame={startGame}
      />
    );
  }

  // Loading state
  if (!gameState) {
    return (
      <div className="min-h-screen bg-[#0a0805] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚔️</div>
          <div className="text-gray-500 text-sm">
            {isConnected ? 'Loading game state...' : 'Connecting...'}
          </div>
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </div>
      </div>
    );
  }

  // ── Active Game ──

  const mapFilter: 'westeros' | 'essos' | 'both' =
    gameState.mode === 'world_at_war' ? 'both' :
    gameState.playerCount === 2 ? 'essos' : 'westeros';

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentHouse = HOUSES[currentPlayer?.id];
  const hoveredTerritory = gameState.hoveredTerritory ? gameState.territories[gameState.hoveredTerritory] : null;

  return (
    <div className="h-screen flex flex-col bg-[#0a0805] text-white overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Header */}
      <header className="bg-[#111] border-b border-[#2a2520] px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[#DAA520] font-serif font-bold text-sm">Round {gameState.round}</span>
          <span className="text-gray-600">|</span>
          <PhaseIndicator currentPhase={gameState.currentPhase} mode={gameState.mode} />
        </div>
        <div className="flex items-center gap-3">
          {!isMyTurn && (
            <span className="text-xs text-gray-500 bg-[#1a1510] px-3 py-1.5 rounded-lg border border-[#333]">
              Waiting for <span className="font-bold" style={{ color: currentHouse?.color }}>{currentHouse?.name}</span>...
            </span>
          )}
          {isMyTurn && (
            <span className="text-xs text-[#DAA520] bg-[#DAA520]/10 px-3 py-1.5 rounded-lg border border-[#DAA520]/30 font-bold">
              Your Turn!
            </span>
          )}
          {currentHouse && (
            <div className="flex items-center gap-2">
              <span className="text-base">{currentHouse.sigil}</span>
              <span className="text-sm font-bold font-serif" style={{ color: currentHouse.color }}>
                {currentHouse.name}&apos;s Turn
              </span>
            </div>
          )}
          {!isConnected && (
            <span className="text-xs text-red-500">Reconnecting...</span>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Player HUDs */}
        <aside className="w-52 bg-[#0d0d0d] border-r border-[#2a2520] shrink-0 overflow-y-auto">
          <div className="px-2 py-2 border-b border-[#2a2520]">
            <span className="text-[10px] text-gray-600 font-bold tracking-wider">HOUSES</span>
          </div>
          <PlayerHUD
            players={gameState.players}
            currentPlayerIndex={gameState.currentPlayerIndex}
            territories={gameState.territories}
            mode={gameState.mode}
          />
        </aside>

        {/* Map area */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <button
              onClick={() => setShowNames(!showNames)}
              className="p-1.5 bg-[#1a1510]/80 border border-[#4a3828] rounded text-gray-400 hover:text-white transition-all"
              title="Toggle territory names"
            >
              {showNames ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowRegions(!showRegions)}
              className="p-1.5 bg-[#1a1510]/80 border border-[#4a3828] rounded text-gray-400 hover:text-white transition-all"
              title="Toggle region borders"
            >
              <Map className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 p-2">
            <GameMap
              territories={gameState.territories}
              selectedTerritory={gameState.selectedTerritory}
              targetTerritory={gameState.targetTerritory}
              hoveredTerritory={gameState.hoveredTerritory}
              currentPlayerId={currentPlayer?.id || ''}
              currentPhase={gameState.currentPhase}
              mapFilter={mapFilter}
              onTerritoryClick={handleTerritoryClick}
              onTerritoryHover={handleTerritoryHover}
            />
          </div>

          <GameLog log={gameState.log} />
        </main>

        {/* Right sidebar - Action Panel */}
        <aside className="w-56 bg-[#0d0d0d] border-l border-[#2a2520] shrink-0 overflow-y-auto">
          <div className="px-3 py-2 border-b border-[#2a2520]">
            <span className="text-[10px] text-gray-600 font-bold tracking-wider">ACTIONS</span>
          </div>
          {isMyTurn ? (
            <ActionPanel state={gameState} dispatch={dispatch} />
          ) : (
            <div className="p-3">
              <div className="bg-[#1a1510] rounded-lg border border-[#333] p-4 text-center">
                <div className="text-2xl mb-2">{currentHouse?.sigil || '⏳'}</div>
                <div className="text-sm text-gray-400">
                  Waiting for
                </div>
                <div className="text-sm font-bold mt-1" style={{ color: currentHouse?.color }}>
                  {currentHouse?.name || 'opponent'}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {hoveredTerritory && (
        <TerritoryTooltip territory={hoveredTerritory} position={mousePos} />
      )}

      {gameState.activeBattle && (
        <BattlePanel
          battle={gameState.activeBattle}
          state={gameState}
          attackArmyCount={gameState.attackArmyCount}
          onSetAttackArmies={(count) => dispatch({ type: 'SET_ATTACK_ARMIES', count })}
          onRollDice={() => dispatch({ type: 'ROLL_DICE' })}
          onContinue={() => dispatch({ type: 'CONTINUE_BATTLE' })}
          onEndInvasion={() => dispatch({ type: 'END_INVASION' })}
        />
      )}

      {gameState.gameOver && (
        <GameOverScreen
          state={gameState}
          onRestart={() => window.location.href = '/game'}
        />
      )}
    </div>
  );
}
