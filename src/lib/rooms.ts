// ─── In-memory Room Manager ──────────────────────────────────────────────────
// Server-authoritative game state. SSE connections for real-time broadcast.

import { v4 as uuidv4 } from 'uuid';
import { GameState, Player, GameMode } from '../app/game/reducer';
import { Territory, ALL_TERRITORIES, WESTEROS_TERRITORIES, ESSOS_TERRITORIES, ALL_REGIONS, generateTerritoryCards } from '../app/game/data/territories';
import { HOUSES, getTurnOrderBonuses } from '../app/game/data/houses';

// ─── Types ───────────────────────────────────────────────────────────────────

export type StartingMethod = 'random' | 'seat_based';

export interface RoomPlayer {
  playerId: string;
  nickname: string;
  houseId: string | null;     // chosen house, null until picked
  isLeader: boolean;
  connected: boolean;
  disconnectedAt: number | null;
}

export interface LobbyState {
  roomId: string;
  players: RoomPlayer[];
  mode: GameMode;
  startingMethod: StartingMethod;
  started: boolean;
  maxPlayers: number;
}

export interface Room {
  id: string;
  players: RoomPlayer[];
  mode: GameMode;
  startingMethod: StartingMethod;
  gameState: GameState | null;  // null until game starts
  sseControllers: Map<string, ReadableStreamDefaultController>; // playerId → controller
  createdAt: number;
  started: boolean;
}

// ─── Room Store ──────────────────────────────────────────────────────────────
// Use globalThis to survive Next.js dev-mode HMR / module re-imports

const globalForRooms = globalThis as unknown as {
  __risk_rooms?: Map<string, Room>;
};

if (!globalForRooms.__risk_rooms) {
  globalForRooms.__risk_rooms = new Map<string, Room>();
}

const rooms = globalForRooms.__risk_rooms;

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ─── Room Operations ─────────────────────────────────────────────────────────

export function createRoom(mode: GameMode): { roomId: string } {
  let roomId = generateRoomId();
  while (rooms.has(roomId)) {
    roomId = generateRoomId();
  }

  const room: Room = {
    id: roomId,
    players: [],
    mode,
    startingMethod: 'random',
    gameState: null,
    sseControllers: new Map(),
    createdAt: Date.now(),
    started: false,
  };

  rooms.set(roomId, room);
  return { roomId };
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

export function joinRoom(roomId: string, nickname: string): { playerId: string; isLeader: boolean } | { error: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.started) return { error: 'Game already started' };

  const maxPlayers = room.mode === 'world_at_war' ? 7 : 5;
  if (room.players.length >= maxPlayers) return { error: 'Room is full' };

  const trimmed = nickname.trim().slice(0, 20);
  if (!trimmed) return { error: 'Nickname is required' };
  if (room.players.some(p => p.nickname.toLowerCase() === trimmed.toLowerCase())) {
    return { error: 'Nickname already taken' };
  }

  const isLeader = room.players.length === 0;
  const playerId = uuidv4();

  room.players.push({
    playerId,
    nickname: trimmed,
    houseId: null,
    isLeader,
    connected: true,
    disconnectedAt: null,
  });

  broadcastLobby(room);
  return { playerId, isLeader };
}

export function selectHouse(roomId: string, playerId: string, houseId: string): { error?: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.started) return { error: 'Game already started' };

  // Validate house exists
  if (!HOUSES[houseId]) return { error: 'Invalid house' };

  // Check house not already taken
  if (room.players.some(p => p.houseId === houseId && p.playerId !== playerId)) {
    return { error: 'House already taken' };
  }

  const player = room.players.find(p => p.playerId === playerId);
  if (!player) return { error: 'Player not found' };

  player.houseId = houseId;
  broadcastLobby(room);
  return {};
}

export function setStartingMethod(roomId: string, playerId: string, method: StartingMethod): { error?: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };

  const player = room.players.find(p => p.playerId === playerId);
  if (!player?.isLeader) return { error: 'Only the leader can change starting method' };

  room.startingMethod = method;
  broadcastLobby(room);
  return {};
}

export function setMode(roomId: string, playerId: string, mode: GameMode): { error?: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.started) return { error: 'Game already started' };

  const player = room.players.find(p => p.playerId === playerId);
  if (!player?.isLeader) return { error: 'Only the leader can change mode' };

  room.mode = mode;
  // Clear house selections when mode changes (different house availability)
  room.players.forEach(p => { p.houseId = null; });
  broadcastLobby(room);
  return {};
}

// ─── Game Start ──────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function startGame(roomId: string, playerId: string): { error?: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.started) return { error: 'Game already started' };

  const leader = room.players.find(p => p.playerId === playerId);
  if (!leader?.isLeader) return { error: 'Only the leader can start the game' };

  if (room.players.length < 2) return { error: 'Need at least 2 players' };

  // Check all players have houses
  const unhousedPlayers = room.players.filter(p => !p.houseId);
  if (unhousedPlayers.length > 0) {
    return { error: `Players without houses: ${unhousedPlayers.map(p => p.nickname).join(', ')}` };
  }

  // Build the game state
  const playerCount = room.players.length;
  const houseIds = room.players.map(p => p.houseId!);
  const mode = room.mode;

  const characterNames: Record<string, string[]> = {
    stark: ['Eddard', 'Robb', 'Jon', 'Arya'],
    baratheon: ['Robert', 'Stannis', 'Renly', 'Davos'],
    lannister: ['Tywin', 'Cersei', 'Jaime', 'Tyrion'],
    tyrell: ['Mace', 'Margaery', 'Loras', 'Olenna'],
    martell: ['Doran', 'Oberyn', 'Arianne', 'Hotah'],
    targaryen: ['Daenerys', 'Viserys', 'Jorah', 'Missandei'],
    ghiscari: ['Kraznys', 'Oznak', 'Grazdan', 'Hizdahr'],
  };

  // Create Player objects (map room player → game player)
  const players: Player[] = room.players.map((rp, idx) => {
    const house = HOUSES[rp.houseId!];
    const chars: Record<string, { active: boolean; name: string; cost: number }> = {};
    (characterNames[rp.houseId!] || []).forEach((name, i) => {
      chars[name.toLowerCase()] = { active: true, name, cost: (i + 1) * 100 };
    });

    return {
      id: rp.houseId!,  // house ID is the player ID in game state
      name: `${rp.nickname} (${house.name})`,
      color: house.color,
      sigil: house.sigil,
      isHuman: true,
      armies: { onBoard: 0, reserve: house.startArmies[playerCount] || 20 },
      gold: mode !== 'skirmish' ? getTurnOrderBonuses(idx, playerCount).gold : 0,
      victoryPoints: 0,
      territoryCards: [],
      maesterCards: [],
      objectiveCards: [],
      characterCards: chars,
      eliminated: false,
      conqueredThisTurn: false,
    };
  });

  // Select relevant territories
  let relevantTerritories: Territory[];
  if (mode === 'world_at_war') {
    relevantTerritories = ALL_TERRITORIES;
  } else if (playerCount === 2) {
    relevantTerritories = ESSOS_TERRITORIES;
  } else {
    relevantTerritories = WESTEROS_TERRITORIES;
  }

  const terrMap: Record<string, Territory> = {};
  relevantTerritories.forEach(t => { terrMap[t.id] = { ...t }; });

  // Territory assignment based on starting method
  if (room.startingMethod === 'seat_based') {
    // Each house gets its seat + territories from its region
    const assignedTerritories = new Set<string>();

    players.forEach(p => {
      const house = HOUSES[p.id];

      // Give seat territory if it exists in the map
      if (terrMap[house.seat]) {
        terrMap[house.seat].owner = p.id;
        terrMap[house.seat].armies = 2;
        p.armies.onBoard += 2;
        p.armies.reserve -= 2;
        assignedTerritories.add(house.seat);
      }

      // Give 2 more random territories from the same region as house seat
      const seatTerritory = relevantTerritories.find(t => t.id === house.seat);
      const seatRegion = seatTerritory?.region;
      const regionTerritories = relevantTerritories
        .filter(t => t.region === seatRegion && !assignedTerritories.has(t.id) && t.id !== house.seat);

      const shuffledRegion = shuffleArray(regionTerritories);
      const extraCount = Math.min(2, shuffledRegion.length);

      for (let i = 0; i < extraCount; i++) {
        const tid = shuffledRegion[i].id;
        terrMap[tid].owner = p.id;
        terrMap[tid].armies = 2;
        p.armies.onBoard += 2;
        p.armies.reserve -= 2;
        assignedTerritories.add(tid);
      }
    });

    // Remaining territories stay unowned (neutral with 2 armies for gameplay)
    for (const tid of Object.keys(terrMap)) {
      if (!terrMap[tid].owner) {
        terrMap[tid].isNeutral = true;
        terrMap[tid].armies = 2;
      }
    }
  } else {
    // Random deal - shuffle and distribute equally
    const terrIds = shuffleArray(Object.keys(terrMap));
    const perPlayer = Math.floor(terrIds.length / players.length);
    const remainder = terrIds.length - perPlayer * players.length;

    let idx = 0;
    players.forEach((p, pi) => {
      const count = pi < remainder ? perPlayer + 1 : perPlayer;
      for (let i = 0; i < count; i++) {
        const tid = terrIds[idx++];
        terrMap[tid].owner = p.id;
        terrMap[tid].armies = 2;
        p.armies.onBoard += 2;
        p.armies.reserve -= 2;
      }
    });

    // Mark truly remaining territories as neutral
    for (const tid of Object.keys(terrMap)) {
      if (!terrMap[tid].owner) {
        terrMap[tid].isNeutral = true;
        terrMap[tid].armies = 2;
      }
    }
  }

  // Randomize turn order
  const shuffledOrder = shuffleArray(houseIds);

  // Generate territory card deck
  const deck = shuffleArray(generateTerritoryCards(relevantTerritories));

  const gameState: GameState = {
    mode,
    subMode: mode,
    setupStep: 'ready',
    round: 1,
    currentPlayerIndex: 0,
    currentPhase: 'reinforce',
    players: reorderPlayers(players, shuffledOrder),
    territories: terrMap,
    turnOrder: shuffledOrder,
    activeBattle: null,
    selectedTerritory: null,
    targetTerritory: null,
    log: [`Game started! Turn order: ${shuffledOrder.map(h => HOUSES[h].name).join(' → ')}`],
    gameOver: false,
    winner: null,
    playerCount,
    cardSetTradeCount: 0,
    reinforcementsRemaining: 0, // will be calculated below
    maneuverDone: false,
    territoryCardDeck: deck,
    endGameCardInserted: false,
    hoveredTerritory: null,
    deploymentArmies: {},
    showCardTradePanel: false,
    selectedCards: [],
    attackArmyCount: 1,
    moveArmyCount: 1,
  };

  // Calculate reinforcements for the first player
  gameState.reinforcementsRemaining = calculateReinforcements(gameState);
  gameState.log.push(`Round 1 begins. ${gameState.players[0].name}'s turn.`);

  room.gameState = gameState;
  room.started = true;

  broadcastGameState(room);
  return {};
}

function reorderPlayers(players: Player[], turnOrder: string[]): Player[] {
  return turnOrder.map(hid => players.find(p => p.id === hid)!).filter(Boolean);
}

function calculateReinforcements(state: GameState): number {
  const player = state.players[state.currentPlayerIndex];
  const territories = Object.values(state.territories);
  const ownedTerritories = territories.filter(t => t.owner === player.id);
  const castleCount = ownedTerritories.filter(t => t.hascastle).length;
  const base = Math.max(3, Math.floor((ownedTerritories.length + castleCount) / 3));

  let regionBonus = 0;
  for (const region of ALL_REGIONS) {
    const ownsAll = region.territories.every((tid: string) =>
      state.territories[tid]?.owner === player.id
    );
    if (ownsAll) regionBonus += region.bonus;
  }

  return base + regionBonus;
}

// ─── SSE Connection Management ───────────────────────────────────────────────

export function addSSEConnection(roomId: string, playerId: string, controller: ReadableStreamDefaultController): void {
  const room = rooms.get(roomId);
  if (!room) return;

  room.sseControllers.set(playerId, controller);

  // Mark player as connected
  const player = room.players.find(p => p.playerId === playerId);
  if (player) {
    player.connected = true;
    player.disconnectedAt = null;
  }
}

export function removeSSEConnection(roomId: string, playerId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  room.sseControllers.delete(playerId);

  const player = room.players.find(p => p.playerId === playerId);
  if (player) {
    player.connected = false;
    player.disconnectedAt = Date.now();
  }

  broadcastLobby(room);
}

// ─── Broadcasting ────────────────────────────────────────────────────────────

function sendSSE(controller: ReadableStreamDefaultController, event: string, data: unknown): void {
  try {
    const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    controller.enqueue(new TextEncoder().encode(msg));
  } catch {
    // Connection closed, ignore
  }
}

export function broadcastLobby(room: Room): void {
  const lobbyState = getLobbyState(room);
  for (const [, controller] of room.sseControllers) {
    sendSSE(controller, 'lobby', lobbyState);
  }
}

export function broadcastGameState(room: Room): void {
  if (!room.gameState) return;
  for (const [, controller] of room.sseControllers) {
    sendSSE(controller, 'game_state', room.gameState);
  }
}

export function getLobbyState(room: Room): LobbyState {
  return {
    roomId: room.id,
    players: room.players.map(p => ({
      playerId: p.playerId,
      nickname: p.nickname,
      houseId: p.houseId,
      isLeader: p.isLeader,
      connected: p.connected,
      disconnectedAt: p.disconnectedAt,
    })),
    mode: room.mode,
    startingMethod: room.startingMethod,
    started: room.started,
    maxPlayers: room.mode === 'world_at_war' ? 7 : 5,
  };
}

// ─── Reconnection ────────────────────────────────────────────────────────────

export function reconnectPlayer(roomId: string, playerId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;

  const player = room.players.find(p => p.playerId === playerId);
  if (!player) return false;

  player.connected = true;
  player.disconnectedAt = null;
  return true;
}

// ─── Get player's house ID from room ─────────────────────────────────────────

export function getPlayerHouseId(roomId: string, playerId: string): string | null {
  const room = rooms.get(roomId);
  if (!room) return null;
  const player = room.players.find(p => p.playerId === playerId);
  return player?.houseId || null;
}

// ─── Room Cleanup (optional: remove stale rooms) ────────────────────────────

export function cleanupStaleRooms(): void {
  const now = Date.now();
  const STALE_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours

  for (const [id, room] of rooms) {
    if (now - room.createdAt > STALE_TIMEOUT) {
      rooms.delete(id);
    }
  }
}
