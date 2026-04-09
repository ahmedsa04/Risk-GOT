'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Crown, Globe, Users, ArrowRight } from 'lucide-react';
import type { GameMode } from './reducer';

const MODES: { id: GameMode; label: string; desc: string; icon: React.ReactNode; players: string }[] = [
  { id: 'skirmish', label: 'Skirmish', desc: 'Classic Risk on a single map', icon: <Swords className="w-6 h-6 text-red-500" />, players: '2-5' },
  { id: 'dominion', label: 'Dominion', desc: 'Full rules with Gold & Victory Points', icon: <Crown className="w-6 h-6 text-[#DAA520]" />, players: '3-5' },
  { id: 'world_at_war', label: 'World at War', desc: 'Both Westeros & Essos maps', icon: <Globe className="w-6 h-6 text-blue-400" />, players: '6-7' },
];

export default function GameLandingPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<GameMode>('skirmish');
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'create' | 'join'>('create');

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      const resp = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: selectedMode }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to create room');
      router.push(`/game/${data.roomId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create room');
      setCreating(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setError('Enter a valid room code');
      return;
    }
    router.push(`/game/${code}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0805] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-5xl font-bold text-[#DAA520] font-serif tracking-wider mb-2"
            style={{ textShadow: '0 0 40px rgba(218,165,32,0.3)' }}>
            RISK
          </h1>
          <h2 className="text-xl text-gray-400 font-serif tracking-[0.3em]">GAME OF THRONES</h2>
          <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent mx-auto mt-4" />
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-[#111] rounded-xl overflow-hidden border border-[#333]">
          <button
            onClick={() => { setTab('create'); setError(null); }}
            className={`flex-1 py-3 text-sm font-bold font-serif transition-all ${
              tab === 'create'
                ? 'bg-[#DAA520]/15 text-[#DAA520] border-b-2 border-[#DAA520]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Create Game
          </button>
          <button
            onClick={() => { setTab('join'); setError(null); }}
            className={`flex-1 py-3 text-sm font-bold font-serif transition-all ${
              tab === 'join'
                ? 'bg-[#DAA520]/15 text-[#DAA520] border-b-2 border-[#DAA520]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Join Game
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-2 mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {tab === 'create' && (
          <div>
            {/* Mode selection */}
            <div className="space-y-3 mb-6">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                    selectedMode === m.id
                      ? 'border-[#DAA520] bg-[#DAA520]/10'
                      : 'border-[#333] bg-[#1a1510] hover:border-[#555]'
                  }`}
                >
                  <div className="shrink-0">{m.icon}</div>
                  <div className="flex-1">
                    <div className={`font-bold font-serif ${selectedMode === m.id ? 'text-[#DAA520]' : 'text-gray-300'}`}>
                      {m.label}
                    </div>
                    <div className="text-xs text-gray-500">{m.desc}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Users className="w-3.5 h-3.5" />
                    {m.players}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-black font-bold font-serif text-lg hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20"
            >
              {creating ? 'Creating...' : 'Create Room'}
              {!creating && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        )}

        {tab === 'join' && (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-bold tracking-wider block mb-2">ROOM CODE</label>
              <input
                type="text"
                placeholder="Enter 6-character room code..."
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                autoFocus
                className="w-full bg-[#1a1510] border border-[#4a3828] rounded-xl px-4 py-3 text-white text-center font-mono text-2xl tracking-[0.3em] placeholder-gray-700 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-[#DAA520] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={joinCode.trim().length < 4}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-black font-bold font-serif text-lg hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Join Room
            </button>
          </form>
        )}

        <div className="text-center mt-8 text-[10px] text-gray-700">
          Online Multiplayer · Max 7 Players · Real-time SSE
        </div>
      </div>
    </div>
  );
}
