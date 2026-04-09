'use client';

import React, { useState } from 'react';
import { HOUSES } from '../data/houses';
import { Crown, Swords, Globe, Users, Copy, Check, Dice1 } from 'lucide-react';
import type { LobbyState, StartingMethod } from '@/lib/rooms';
import type { GameMode } from '../reducer';

interface LobbyScreenProps {
  roomId: string;
  lobby: LobbyState;
  myPlayerId: string;
  isConnected: boolean;
  error: string | null;
  onSelectHouse: (houseId: string) => void;
  onSetStartingMethod: (method: StartingMethod) => void;
  onSetMode: (mode: GameMode) => void;
  onStartGame: () => void;
}

const MODE_META: Record<GameMode, { icon: React.ReactNode; label: string; desc: string }> = {
  skirmish: { icon: <Swords className="w-5 h-5 text-red-500" />, label: 'Skirmish', desc: 'Classic Risk rules' },
  dominion: { icon: <Crown className="w-5 h-5 text-[#DAA520]" />, label: 'Dominion', desc: 'Full rules with Gold & VP' },
  world_at_war: { icon: <Globe className="w-5 h-5 text-blue-400" />, label: 'World at War', desc: 'Both maps, 6-7 players' },
};

const ALL_HOUSES = ['stark', 'baratheon', 'lannister', 'tyrell', 'martell', 'targaryen', 'ghiscari'];

export default function LobbyScreen({
  roomId,
  lobby,
  myPlayerId,
  isConnected,
  error,
  onSelectHouse,
  onSetStartingMethod,
  onSetMode,
  onStartGame,
}: LobbyScreenProps) {
  const [copied, setCopied] = useState(false);

  const me = lobby.players.find(p => p.playerId === myPlayerId);
  const isLeader = me?.isLeader || false;
  const myHouseId = me?.houseId;

  // Get available houses based on mode
  const availableHouses = lobby.mode === 'world_at_war'
    ? ALL_HOUSES
    : lobby.mode === 'skirmish' && lobby.players.length <= 2
      ? ['targaryen', 'ghiscari']
      : ALL_HOUSES.filter(h => HOUSES[h].map === 'westeros');

  const takenHouses = new Set(lobby.players.map(p => p.houseId).filter(Boolean));

  const allHaveHouses = lobby.players.every(p => p.houseId);
  const canStart = isLeader && lobby.players.length >= 2 && allHaveHouses;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/game/${roomId}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0805] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚔️</div>
          <h1 className="text-4xl font-bold text-[#DAA520] font-serif tracking-wider mb-1"
            style={{ textShadow: '0 0 30px rgba(218,165,32,0.3)' }}>
            RISK
          </h1>
          <h2 className="text-lg text-gray-400 font-serif tracking-widest">GAME OF THRONES</h2>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent mx-auto mt-3" />
        </div>

        {/* Share Link */}
        <div className="bg-[#1a1510] border border-[#4a3828] rounded-xl p-4 mb-6">
          <div className="text-xs text-gray-500 font-bold tracking-wider mb-2">SHARE THIS LINK TO INVITE PLAYERS</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-300 font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-[#DAA520] text-black rounded-lg font-bold text-sm hover:bg-yellow-500 transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Room: <span className="text-[#DAA520] font-mono font-bold">{roomId}</span>
            {' '} · {lobby.players.length}/{lobby.maxPlayers} players
            {!isConnected && <span className="text-red-500 ml-2">· Reconnecting...</span>}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-2 mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Mode Selection (leader only) */}
        {isLeader && (
          <div className="bg-[#1a1510] border border-[#4a3828] rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-500 font-bold tracking-wider mb-3">GAME MODE (Leader)</div>
            <div className="flex gap-2">
              {(['skirmish', 'dominion', 'world_at_war'] as GameMode[]).map(m => {
                const meta = MODE_META[m];
                const isActive = lobby.mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => onSetMode(m)}
                    className={`flex-1 p-3 rounded-lg border transition-all text-left ${
                      isActive
                        ? 'border-[#DAA520] bg-[#DAA520]/10'
                        : 'border-[#333] bg-[#111] hover:border-[#555]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {meta.icon}
                      <span className={`text-sm font-bold ${isActive ? 'text-[#DAA520]' : 'text-gray-400'}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500">{meta.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Starting Method (leader only) */}
        {isLeader && (
          <div className="bg-[#1a1510] border border-[#4a3828] rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-500 font-bold tracking-wider mb-3">STARTING METHOD (Leader)</div>
            <div className="flex gap-2">
              <button
                onClick={() => onSetStartingMethod('random')}
                className={`flex-1 p-3 rounded-lg border transition-all ${
                  lobby.startingMethod === 'random'
                    ? 'border-[#DAA520] bg-[#DAA520]/10'
                    : 'border-[#333] bg-[#111] hover:border-[#555]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Dice1 className="w-4 h-4 text-purple-400" />
                  <span className={`text-sm font-bold ${lobby.startingMethod === 'random' ? 'text-[#DAA520]' : 'text-gray-400'}`}>
                    Random Deal
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">Territories shuffled & dealt equally. 2 armies each.</div>
              </button>
              <button
                onClick={() => onSetStartingMethod('seat_based')}
                className={`flex-1 p-3 rounded-lg border transition-all ${
                  lobby.startingMethod === 'seat_based'
                    ? 'border-[#DAA520] bg-[#DAA520]/10'
                    : 'border-[#333] bg-[#111] hover:border-[#555]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className={`text-sm font-bold ${lobby.startingMethod === 'seat_based' ? 'text-[#DAA520]' : 'text-gray-400'}`}>
                    Seat-Based
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">Each house starts at its seat + 2 nearby territories.</div>
              </button>
            </div>
          </div>
        )}

        {/* Non-leader info */}
        {!isLeader && (
          <div className="bg-[#1a1510] border border-[#4a3828] rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">
                <span className="font-bold text-[#DAA520]">{MODE_META[lobby.mode].label}</span> mode
                {' '} · {lobby.startingMethod === 'random' ? 'Random Deal' : 'Seat-Based'} start
              </div>
            </div>
            <div className="text-[10px] text-gray-600 mt-1">The leader controls these settings.</div>
          </div>
        )}

        {/* Players */}
        <div className="bg-[#1a1510] border border-[#4a3828] rounded-xl p-4 mb-4">
          <div className="text-xs text-gray-500 font-bold tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> PLAYERS ({lobby.players.length}/{lobby.maxPlayers})
          </div>
          <div className="space-y-2">
            {lobby.players.map(p => {
              const house = p.houseId ? HOUSES[p.houseId] : null;
              const isMe = p.playerId === myPlayerId;
              return (
                <div
                  key={p.playerId}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isMe ? 'border-[#DAA520]/50 bg-[#DAA520]/5' : 'border-[#333] bg-[#111]'
                  }`}
                >
                  <div className="text-2xl w-8 text-center">
                    {house ? house.sigil : '❓'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{p.nickname}</span>
                      {p.isLeader && (
                        <span className="text-[10px] bg-[#DAA520]/20 text-[#DAA520] px-1.5 py-0.5 rounded font-bold">LEADER</span>
                      )}
                      {isMe && (
                        <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded font-bold">YOU</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {house ? (
                        <span style={{ color: house.color }}>{house.name}</span>
                      ) : (
                        <span className="text-gray-600 italic">Choosing house...</span>
                      )}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${p.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              );
            })}

            {/* Empty slots */}
            {Array.from({ length: lobby.maxPlayers - lobby.players.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-lg border border-[#222] bg-[#0d0d0d] opacity-40">
                <div className="text-2xl w-8 text-center text-gray-700">👤</div>
                <div className="text-sm text-gray-700 italic">Waiting for player...</div>
              </div>
            ))}
          </div>
        </div>

        {/* House Selection */}
        <div className="bg-[#1a1510] border border-[#4a3828] rounded-xl p-4 mb-6">
          <div className="text-xs text-gray-500 font-bold tracking-wider mb-3">CHOOSE YOUR HOUSE</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableHouses.map(hid => {
              const house = HOUSES[hid];
              const taken = takenHouses.has(hid);
              const isMine = myHouseId === hid;
              const takenByWho = lobby.players.find(p => p.houseId === hid);

              return (
                <button
                  key={hid}
                  onClick={() => !taken || isMine ? onSelectHouse(hid) : null}
                  disabled={taken && !isMine}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isMine
                      ? 'border-[#DAA520] bg-[#DAA520]/15 ring-1 ring-[#DAA520]'
                      : taken
                        ? 'border-[#333] bg-[#111] opacity-40 cursor-not-allowed'
                        : 'border-[#333] bg-[#111] hover:border-[#555] cursor-pointer'
                  }`}
                >
                  <div className="text-2xl mb-1">{house.sigil}</div>
                  <div className={`text-xs font-bold ${isMine ? 'text-[#DAA520]' : 'text-gray-400'}`}>
                    {house.name.replace('House ', '')}
                  </div>
                  {taken && !isMine && takenByWho && (
                    <div className="text-[9px] text-gray-600 mt-0.5">{takenByWho.nickname}</div>
                  )}
                  {isMine && (
                    <div className="text-[9px] text-[#DAA520] mt-0.5">Selected</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Game Button (leader) */}
        {isLeader && (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className={`w-full py-4 rounded-xl text-lg font-bold font-serif transition-all flex items-center justify-center gap-2 ${
              canStart
                ? 'bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-black hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-900/30'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            ⚔️ BEGIN THE WAR
          </button>
        )}

        {!isLeader && (
          <div className="text-center text-gray-500 text-sm py-4">
            Waiting for the leader to start the game...
          </div>
        )}

        {!canStart && isLeader && (
          <div className="text-center text-gray-600 text-xs mt-2">
            {lobby.players.length < 2 ? 'Need at least 2 players' : 'All players must choose a house'}
          </div>
        )}
      </div>
    </div>
  );
}
