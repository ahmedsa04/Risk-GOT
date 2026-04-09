'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameAction } from '../reducer';
import type { LobbyState, StartingMethod } from '@/lib/rooms';
import type { GameMode } from '../reducer';

const STORAGE_KEY_PREFIX = 'risk-got-';

interface UseGameRoomReturn {
  // Connection
  hydrated: boolean;
  isConnected: boolean;
  myPlayerId: string | null;
  error: string | null;

  // Lobby
  lobby: LobbyState | null;
  joinRoom: (nickname: string) => Promise<void>;
  selectHouse: (houseId: string) => Promise<void>;
  setStartingMethod: (method: StartingMethod) => Promise<void>;
  setMode: (mode: GameMode) => Promise<void>;
  startGame: () => Promise<void>;

  // Game
  gameState: GameState | null;
  dispatch: (action: GameAction) => void;
  isMyTurn: boolean;
  myHouseId: string | null;
}

export function useGameRoom(roomId: string): UseGameRoomReturn {
  const [isConnected, setIsConnected] = useState(false);
  const storageKey = `${STORAGE_KEY_PREFIX}${roomId}`;
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lobby, setLobby] = useState<LobbyState | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [localHover, setLocalHover] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Restore playerId from sessionStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setMyPlayerId(stored);
    setHydrated(true);
  }, [storageKey]);

  // SSE connection
  useEffect(() => {
    if (!myPlayerId) return;

    const connect = () => {
      const es = new EventSource(`/api/game/${roomId}/events?playerId=${myPlayerId}`);
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      es.addEventListener('connected', () => {
        setIsConnected(true);
      });

      es.addEventListener('lobby', (e) => {
        try {
          const data = JSON.parse(e.data) as LobbyState;
          setLobby(data);
        } catch { /* ignore parse errors */ }
      });

      es.addEventListener('game_state', (e) => {
        try {
          const data = JSON.parse(e.data) as GameState;
          setGameState(data);
        } catch { /* ignore parse errors */ }
      });

      es.onerror = () => {
        setIsConnected(false);
        es.close();
        // Reconnect after 2 seconds
        setTimeout(() => {
          if (eventSourceRef.current === es) {
            connect();
          }
        }, 2000);
      };
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [roomId, myPlayerId]);

  // API call helper
  const apiCall = useCallback(async (url: string, body: Record<string, unknown>) => {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }, []);

  // Join room
  const joinRoom = useCallback(async (nickname: string) => {
    try {
      setError(null);
      const data = await apiCall(`/api/game/${roomId}/join`, {
        action: 'join',
        nickname,
      });
      setMyPlayerId(data.playerId);
      sessionStorage.setItem(storageKey, data.playerId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to join');
    }
  }, [roomId, storageKey, apiCall]);

  // Select house
  const selectHouse = useCallback(async (houseId: string) => {
    if (!myPlayerId) return;
    try {
      await apiCall(`/api/game/${roomId}/join`, {
        action: 'select_house',
        playerId: myPlayerId,
        houseId,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to select house');
    }
  }, [roomId, myPlayerId, apiCall]);

  // Set starting method
  const setStartingMethod = useCallback(async (method: StartingMethod) => {
    if (!myPlayerId) return;
    try {
      await apiCall(`/api/game/${roomId}/join`, {
        action: 'set_starting_method',
        playerId: myPlayerId,
        method,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to set method');
    }
  }, [roomId, myPlayerId, apiCall]);

  // Set mode
  const setMode = useCallback(async (mode: GameMode) => {
    if (!myPlayerId) return;
    try {
      await apiCall(`/api/game/${roomId}/join`, {
        action: 'set_mode',
        playerId: myPlayerId,
        mode,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to set mode');
    }
  }, [roomId, myPlayerId, apiCall]);

  // Start game
  const startGame = useCallback(async () => {
    if (!myPlayerId) return;
    try {
      await apiCall(`/api/game/${roomId}/join`, {
        action: 'start',
        playerId: myPlayerId,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to start game');
    }
  }, [roomId, myPlayerId, apiCall]);

  // Dispatch game action
  const dispatch = useCallback((action: GameAction) => {
    // Handle hover locally (don't send to server for performance)
    if (action.type === 'HOVER_TERRITORY') {
      setLocalHover(action.territoryId);
      return;
    }

    if (!myPlayerId) return;

    apiCall(`/api/game/${roomId}/action`, {
      playerId: myPlayerId,
      action,
    }).catch((e: unknown) => {
      setError(e instanceof Error ? e.message : 'Action failed');
    });
  }, [roomId, myPlayerId, apiCall]);

  // Compute derived state
  const myRoomPlayer = lobby?.players.find(p => p.playerId === myPlayerId);
  const myHouseId = myRoomPlayer?.houseId || null;

  const isMyTurn = !!gameState && !!myHouseId &&
    gameState.players[gameState.currentPlayerIndex]?.id === myHouseId;

  // Merge local hover into game state for smooth UX
  const mergedGameState = gameState ? {
    ...gameState,
    hoveredTerritory: localHover,
  } : null;

  return {
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
    gameState: mergedGameState,
    dispatch,
    isMyTurn,
    myHouseId,
  };
}
