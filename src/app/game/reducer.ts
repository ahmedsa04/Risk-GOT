import { Territory, TerritoryCard, ALL_TERRITORIES, ALL_REGIONS, generateTerritoryCards, WESTEROS_TERRITORIES, ESSOS_TERRITORIES } from './data/territories';
import { HOUSES, getHousesForPlayerCount, getTurnOrderBonuses } from './data/houses';

// ─── Types ───────────────────────────────────────────────────────────────────

export type GameMode = 'skirmish' | 'dominion' | 'world_at_war';
export type GamePhase = 'setup' | 'reinforce' | 'invade' | 'maneuver' | 'draw' | 'purchase' | 'refresh' | 'objective' | 'game_over';
export type SetupStep = 'mode_select' | 'player_setup' | 'house_select' | 'initial_placement' | 'ready';

export interface BattleState {
  attackerTerritory: string;
  defenderTerritory: string;
  attackerHouse: string;
  defenderHouse: string;
  attackDice: number[];
  defenseDice: number[];
  attackerLosses: number;
  defenderLosses: number;
  resolved: boolean;
  conqueredThisBattle: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  sigil: string;
  isHuman: boolean;
  armies: { onBoard: number; reserve: number };
  gold: number;
  victoryPoints: number;
  territoryCards: TerritoryCard[];
  maesterCards: string[];
  objectiveCards: string[];
  characterCards: Record<string, { active: boolean; name: string; cost: number }>;
  eliminated: boolean;
  conqueredThisTurn: boolean;
}

export interface GameState {
  mode: GameMode;
  subMode: GameMode;
  setupStep: SetupStep;
  round: number;
  currentPlayerIndex: number;
  currentPhase: GamePhase;
  players: Player[];
  territories: Record<string, Territory>;
  turnOrder: string[];
  activeBattle: BattleState | null;
  selectedTerritory: string | null;
  targetTerritory: string | null;
  log: string[];
  gameOver: boolean;
  winner: string | null;
  playerCount: number;
  cardSetTradeCount: number;
  reinforcementsRemaining: number;
  maneuverDone: boolean;
  territoryCardDeck: TerritoryCard[];
  endGameCardInserted: boolean;
  hoveredTerritory: string | null;
  deploymentArmies: Record<string, number>;
  showCardTradePanel: boolean;
  selectedCards: string[];
  attackArmyCount: number;
  moveArmyCount: number;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export type GameAction =
  | { type: 'SELECT_MODE'; mode: GameMode; subMode?: GameMode }
  | { type: 'SET_PLAYER_COUNT'; count: number }
  | { type: 'ASSIGN_HOUSES' }
  | { type: 'START_GAME' }
  | { type: 'SELECT_TERRITORY'; territoryId: string }
  | { type: 'HOVER_TERRITORY'; territoryId: string | null }
  | { type: 'DEPLOY_ARMY'; territoryId: string; count: number }
  | { type: 'FINISH_REINFORCE' }
  | { type: 'SET_ATTACK_ARMIES'; count: number }
  | { type: 'INITIATE_ATTACK'; from: string; to: string }
  | { type: 'ROLL_DICE' }
  | { type: 'CONTINUE_BATTLE' }
  | { type: 'END_INVASION' }
  | { type: 'FINISH_INVADE' }
  | { type: 'SET_MOVE_COUNT'; count: number }
  | { type: 'MANEUVER'; from: string; to: string; armies: number }
  | { type: 'FINISH_MANEUVER' }
  | { type: 'DRAW_CARD' }
  | { type: 'END_TURN' }
  | { type: 'TOGGLE_CARD_TRADE' }
  | { type: 'SELECT_CARD'; cardId: string }
  | { type: 'TRADE_CARDS' }
  | { type: 'MOVE_ARMIES_IN'; count: number }
  | { type: 'FINISH_DRAW' }
  | { type: 'CLEAR_SELECTION' };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rollDie(sides: number = 6): number {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(count: number, sides: number = 6): number[] {
  return Array.from({ length: count }, () => rollDie(sides)).sort((a, b) => b - a);
}

function calculateReinforcements(state: GameState): number {
  const player = state.players[state.currentPlayerIndex];
  const territories = Object.values(state.territories);
  const ownedTerritories = territories.filter(t => t.owner === player.id);
  const castleCount = ownedTerritories.filter(t => t.hascastle).length;

  // Base: (territories + castles) / 3, minimum 3
  const base = Math.max(3, Math.floor((ownedTerritories.length + castleCount) / 3));

  // Region bonuses
  let regionBonus = 0;
  for (const region of ALL_REGIONS) {
    const ownsAll = region.territories.every(tid =>
      state.territories[tid]?.owner === player.id
    );
    if (ownsAll) regionBonus += region.bonus;
  }

  return base + regionBonus;
}

function getReachableTerritories(fromId: string, playerId: string, territories: Record<string, Territory>): string[] {
  const visited = new Set<string>();
  const queue = [fromId];
  visited.add(fromId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const territory = territories[current];
    if (!territory) continue;

    for (const adj of territory.adjacentTerritories) {
      if (!visited.has(adj) && territories[adj]?.owner === playerId) {
        visited.add(adj);
        queue.push(adj);
      }
    }
    // Also check port connections for own territories
    for (const port of territory.portConnections) {
      if (!visited.has(port) && territories[port]?.owner === playerId) {
        visited.add(port);
        queue.push(port);
      }
    }
  }

  visited.delete(fromId);
  return Array.from(visited);
}

function isValidCardSet(cards: TerritoryCard[]): boolean {
  if (cards.length !== 3) return false;
  const types = cards.map(c => c.type);
  const allSame = types.every(i => i === types[0]);
  const allDiff = new Set(types).size === 3;
  return allSame || allDiff;
}

function checkVictory(state: GameState): string | null {
  const activePlayers = state.players.filter(p => !p.eliminated);
  if (activePlayers.length === 1) return activePlayers[0].id;

  // Check if any player owns all territories
  const territories = Object.values(state.territories);
  for (const player of activePlayers) {
    if (territories.every(t => t.owner === player.id)) return player.id;
  }

  if (state.mode === 'dominion' || (state.mode === 'world_at_war' && state.subMode === 'dominion')) {
    for (const player of activePlayers) {
      const house = HOUSES[player.id];
      if (player.victoryPoints >= 10 && state.territories[house.seat]?.owner === player.id) {
        return player.id;
      }
    }
  }

  return null;
}

// ─── Initial State ───────────────────────────────────────────────────────────

export const initialState: GameState = {
  mode: 'skirmish',
  subMode: 'skirmish',
  setupStep: 'mode_select',
  round: 1,
  currentPlayerIndex: 0,
  currentPhase: 'setup',
  players: [],
  territories: {},
  turnOrder: [],
  activeBattle: null,
  selectedTerritory: null,
  targetTerritory: null,
  log: [],
  gameOver: false,
  winner: null,
  playerCount: 3,
  cardSetTradeCount: 0,
  reinforcementsRemaining: 0,
  maneuverDone: false,
  territoryCardDeck: [],
  endGameCardInserted: false,
  hoveredTerritory: null,
  deploymentArmies: {},
  showCardTradePanel: false,
  selectedCards: [],
  attackArmyCount: 1,
  moveArmyCount: 1,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_MODE': {
      return {
        ...state,
        mode: action.mode,
        subMode: action.subMode || action.mode,
        setupStep: 'player_setup',
      };
    }

    case 'SET_PLAYER_COUNT': {
      return { ...state, playerCount: action.count };
    }

    case 'ASSIGN_HOUSES': {
      const houseIds = getHousesForPlayerCount(state.playerCount, state.mode);
      const characterNames: Record<string, string[]> = {
        stark: ['Eddard', 'Robb', 'Jon', 'Arya'],
        baratheon: ['Robert', 'Stannis', 'Renly', 'Davos'],
        lannister: ['Tywin', 'Cersei', 'Jaime', 'Tyrion'],
        tyrell: ['Mace', 'Margaery', 'Loras', 'Olenna'],
        martell: ['Doran', 'Oberyn', 'Arianne', 'Hotah'],
        targaryen: ['Daenerys', 'Viserys', 'Jorah', 'Missandei'],
        ghiscari: ['Kraznys', 'Oznak', 'Grazdan', 'Hizdahr'],
      };

      const players: Player[] = houseIds.map((hid) => {
        const house = HOUSES[hid];
        const chars: Record<string, { active: boolean; name: string; cost: number }> = {};
        (characterNames[hid] || []).forEach((name, i) => {
          chars[name.toLowerCase()] = { active: true, name, cost: (i + 1) * 100 };
        });

        return {
          id: hid,
          name: house.name,
          color: house.color,
          sigil: house.sigil,
          isHuman: true,
          armies: { onBoard: 0, reserve: house.startArmies[state.playerCount] || 20 },
          gold: state.mode !== 'skirmish' ? getTurnOrderBonuses(houseIds.indexOf(hid), state.playerCount).gold : 0,
          victoryPoints: 0,
          territoryCards: [],
          maesterCards: [],
          objectiveCards: [],
          characterCards: chars,
          eliminated: false,
          conqueredThisTurn: false,
        };
      });

      // Build territory map
      let relevantTerritories: Territory[];
      if (state.mode === 'world_at_war') {
        relevantTerritories = ALL_TERRITORIES;
      } else if (state.playerCount === 2) {
        relevantTerritories = ESSOS_TERRITORIES;
      } else {
        relevantTerritories = WESTEROS_TERRITORIES;
      }

      const terrMap: Record<string, Territory> = {};
      relevantTerritories.forEach(t => {
        terrMap[t.id] = { ...t };
      });

      // Skirmish: deal territories randomly
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

      // Mark remaining territories as neutral (for 2p Essos)
      for (const tid of Object.keys(terrMap)) {
        if (!terrMap[tid].owner) {
          terrMap[tid].isNeutral = true;
          terrMap[tid].armies = 2;
        }
      }

      // Generate territory card deck
      const deck = shuffleArray(generateTerritoryCards(relevantTerritories));

      return {
        ...state,
        players,
        territories: terrMap,
        turnOrder: houseIds,
        territoryCardDeck: deck,
        setupStep: 'ready',
      };
    }

    case 'START_GAME': {
      const reinforcements = calculateReinforcements({
        ...state,
        currentPhase: 'reinforce',
      });
      return {
        ...state,
        currentPhase: 'reinforce',
        setupStep: 'ready',
        reinforcementsRemaining: reinforcements,
        log: [`Round 1 begins. ${state.players[0].name}'s turn.`],
      };
    }

    case 'HOVER_TERRITORY': {
      return { ...state, hoveredTerritory: action.territoryId };
    }

    case 'SELECT_TERRITORY': {
      const territory = state.territories[action.territoryId];
      if (!territory) return state;

      const currentPlayer = state.players[state.currentPlayerIndex];

      // During reinforce: select to deploy
      if (state.currentPhase === 'reinforce') {
        if (territory.owner === currentPlayer.id) {
          return { ...state, selectedTerritory: action.territoryId };
        }
        return state;
      }

      // During invade phase
      if (state.currentPhase === 'invade') {
        if (state.activeBattle) return state; // battle in progress

        if (!state.selectedTerritory) {
          // Select own territory as attack source
          if (territory.owner === currentPlayer.id && territory.armies > 1) {
            return { ...state, selectedTerritory: action.territoryId };
          }
          return state;
        }

        // Target selection
        if (action.territoryId === state.selectedTerritory) {
          return { ...state, selectedTerritory: null, targetTerritory: null };
        }

        const source = state.territories[state.selectedTerritory];
        if (territory.owner !== currentPlayer.id) {
          // Check adjacency
          const isAdjacent = source.adjacentTerritories.includes(action.territoryId)
            || (source.hasport && territory.hasport && source.portConnections.includes(action.territoryId));
          if (isAdjacent) {
            return { ...state, targetTerritory: action.territoryId, attackArmyCount: 1 };
          }
        } else {
          // Clicked own territory — change selection
          if (territory.armies > 1) {
            return { ...state, selectedTerritory: action.territoryId, targetTerritory: null };
          }
        }
        return state;
      }

      // During maneuver phase
      if (state.currentPhase === 'maneuver') {
        if (state.maneuverDone) return state;

        if (!state.selectedTerritory) {
          if (territory.owner === currentPlayer.id && territory.armies > 1) {
            return { ...state, selectedTerritory: action.territoryId };
          }
          return state;
        }

        if (action.territoryId === state.selectedTerritory) {
          return { ...state, selectedTerritory: null, targetTerritory: null };
        }

        if (territory.owner === currentPlayer.id) {
          const reachable = getReachableTerritories(state.selectedTerritory, currentPlayer.id, state.territories);
          if (reachable.includes(action.territoryId)) {
            return { ...state, targetTerritory: action.territoryId, moveArmyCount: 1 };
          } else {
            // Switch selection
            if (territory.armies > 1) {
              return { ...state, selectedTerritory: action.territoryId, targetTerritory: null };
            }
          }
        }
        return state;
      }

      return { ...state, selectedTerritory: action.territoryId };
    }

    case 'DEPLOY_ARMY': {
      if (state.currentPhase !== 'reinforce' || state.reinforcementsRemaining <= 0) return state;
      const player = state.players[state.currentPlayerIndex];
      const territory = state.territories[action.territoryId];
      if (!territory || territory.owner !== player.id) return state;

      const count = Math.min(action.count, state.reinforcementsRemaining);
      if (count <= 0) return state;

      const newTerritories = { ...state.territories };
      newTerritories[action.territoryId] = { ...territory, armies: territory.armies + count };

      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex] = {
        ...player,
        armies: { ...player.armies, onBoard: player.armies.onBoard + count, reserve: player.armies.reserve - count },
      };

      return {
        ...state,
        territories: newTerritories,
        players: newPlayers,
        reinforcementsRemaining: state.reinforcementsRemaining - count,
        log: [...state.log, `${player.name} deployed ${count} armies to ${territory.name}.`],
      };
    }

    case 'FINISH_REINFORCE': {
      if (state.reinforcementsRemaining > 0) return state;
      return {
        ...state,
        currentPhase: 'invade',
        selectedTerritory: null,
        targetTerritory: null,
        log: [...state.log, `${state.players[state.currentPlayerIndex].name} enters Invasion phase.`],
      };
    }

    case 'SET_ATTACK_ARMIES': {
      const source = state.territories[state.selectedTerritory || ''];
      if (!source) return state;
      const maxAttack = Math.min(3, source.armies - 1);
      return { ...state, attackArmyCount: Math.min(action.count, maxAttack) };
    }

    case 'INITIATE_ATTACK': {
      const source = state.territories[action.from];
      const target = state.territories[action.to];
      if (!source || !target) return state;

      return {
        ...state,
        activeBattle: {
          attackerTerritory: action.from,
          defenderTerritory: action.to,
          attackerHouse: source.owner!,
          defenderHouse: target.owner || 'neutral',
          attackDice: [],
          defenseDice: [],
          attackerLosses: 0,
          defenderLosses: 0,
          resolved: false,
          conqueredThisBattle: false,
        },
      };
    }

    case 'ROLL_DICE': {
      if (!state.activeBattle || state.activeBattle.resolved) return state;

      const source = state.territories[state.activeBattle.attackerTerritory];
      const target = state.territories[state.activeBattle.defenderTerritory];
      if (!source || !target) return state;

      const atkCount = Math.min(state.attackArmyCount, source.armies - 1, 3);
      const defCount = Math.min(2, target.armies);

      const atkDice = rollDice(atkCount);
      const defDice = rollDice(defCount);

      // Compare pairs
      let atkLoss = 0;
      let defLoss = 0;
      const pairs = Math.min(atkDice.length, defDice.length);
      for (let i = 0; i < pairs; i++) {
        if (atkDice[i] > defDice[i]) {
          defLoss++;
        } else {
          atkLoss++; // defender wins ties
        }
      }

      // Apply losses
      const newTerritories = { ...state.territories };
      newTerritories[state.activeBattle.attackerTerritory] = {
        ...source,
        armies: source.armies - atkLoss,
      };
      newTerritories[state.activeBattle.defenderTerritory] = {
        ...target,
        armies: target.armies - defLoss,
      };

      const conquered = target.armies - defLoss <= 0;

      // If conquered, transfer territory
      if (conquered) {
        const movingIn = Math.min(atkCount, source.armies - atkLoss - 1);
        newTerritories[state.activeBattle.defenderTerritory] = {
          ...newTerritories[state.activeBattle.defenderTerritory],
          owner: source.owner,
          armies: movingIn,
          isNeutral: false,
        };
        newTerritories[state.activeBattle.attackerTerritory] = {
          ...newTerritories[state.activeBattle.attackerTerritory],
          armies: source.armies - atkLoss - movingIn,
        };

        // Update player conquest state
        const newPlayers = [...state.players];
        const atkIdx = newPlayers.findIndex(p => p.id === source.owner);
        if (atkIdx >= 0) {
          newPlayers[atkIdx] = { ...newPlayers[atkIdx], conqueredThisTurn: true };
        }

        // Check if defender eliminated
        const defPlayer = target.owner;
        if (defPlayer) {
          const defStillAlive = Object.values(newTerritories).some(t => t.owner === defPlayer);
          if (!defStillAlive) {
            const defIdx = newPlayers.findIndex(p => p.id === defPlayer);
            if (defIdx >= 0) {
              // Transfer cards
              newPlayers[defIdx] = { ...newPlayers[defIdx], eliminated: true };
              if (atkIdx >= 0) {
                newPlayers[atkIdx] = {
                  ...newPlayers[atkIdx],
                  territoryCards: [...newPlayers[atkIdx].territoryCards, ...newPlayers[defIdx].territoryCards],
                };
              }
            }
          }
        }

        return {
          ...state,
          territories: newTerritories,
          players: newPlayers,
          activeBattle: {
            ...state.activeBattle,
            attackDice: atkDice,
            defenseDice: defDice,
            attackerLosses: atkLoss,
            defenderLosses: defLoss,
            resolved: true,
            conqueredThisBattle: true,
          },
          log: [...state.log, `${HOUSES[source.owner!]?.name || 'Attacker'} conquered ${target.name}!`],
        };
      }

      return {
        ...state,
        territories: newTerritories,
        activeBattle: {
          ...state.activeBattle,
          attackDice: atkDice,
          defenseDice: defDice,
          attackerLosses: atkLoss,
          defenderLosses: defLoss,
          resolved: true,
          conqueredThisBattle: false,
        },
        log: [...state.log,
          `Battle: ${source.name} → ${target.name} | ATK: [${atkDice}] DEF: [${defDice}] | Lost: ATK -${atkLoss}, DEF -${defLoss}`
        ],
      };
    }

    case 'CONTINUE_BATTLE': {
      if (!state.activeBattle) return state;
      const source = state.territories[state.activeBattle.attackerTerritory];
      if (!source || source.armies <= 1) {
        // Can't continue, not enough armies
        return {
          ...state,
          activeBattle: null,
          selectedTerritory: null,
          targetTerritory: null,
        };
      }
      return {
        ...state,
        activeBattle: {
          ...state.activeBattle,
          resolved: false,
          attackDice: [],
          defenseDice: [],
          attackerLosses: 0,
          defenderLosses: 0,
        },
        attackArmyCount: Math.min(state.attackArmyCount, source.armies - 1, 3),
      };
    }

    case 'END_INVASION': {
      return {
        ...state,
        activeBattle: null,
        selectedTerritory: null,
        targetTerritory: null,
      };
    }

    case 'FINISH_INVADE': {
      return {
        ...state,
        currentPhase: 'maneuver',
        selectedTerritory: null,
        targetTerritory: null,
        activeBattle: null,
        maneuverDone: false,
        log: [...state.log, `${state.players[state.currentPlayerIndex].name} enters Maneuver phase.`],
      };
    }

    case 'SET_MOVE_COUNT': {
      return { ...state, moveArmyCount: action.count };
    }

    case 'MANEUVER': {
      if (state.maneuverDone) return state;
      const from = state.territories[action.from];
      const to = state.territories[action.to];
      if (!from || !to) return state;

      const currentPlayer = state.players[state.currentPlayerIndex];
      if (from.owner !== currentPlayer.id || to.owner !== currentPlayer.id) return state;

      const maxMove = from.armies - 1;
      const moveCount = Math.min(action.armies, maxMove);
      if (moveCount <= 0) return state;

      const newTerritories = { ...state.territories };
      newTerritories[action.from] = { ...from, armies: from.armies - moveCount };
      newTerritories[action.to] = { ...to, armies: to.armies + moveCount };

      return {
        ...state,
        territories: newTerritories,
        maneuverDone: true,
        selectedTerritory: null,
        targetTerritory: null,
        log: [...state.log, `${currentPlayer.name} maneuvered ${moveCount} armies from ${from.name} to ${to.name}.`],
      };
    }

    case 'FINISH_MANEUVER': {
      return {
        ...state,
        currentPhase: 'draw',
        selectedTerritory: null,
        targetTerritory: null,
        log: [...state.log, `${state.players[state.currentPlayerIndex].name} enters Draw phase.`],
      };
    }

    case 'DRAW_CARD': {
      const player = state.players[state.currentPlayerIndex];
      if (!player.conqueredThisTurn) return state;
      if (state.territoryCardDeck.length === 0) return state;

      const newDeck = [...state.territoryCardDeck];
      const drawn = newDeck.pop()!;

      // Check end game (end game card has empty territoryId and type 'wild' with special id)
      if (drawn.id === 'end-game') {
        return {
          ...state,
          gameOver: true,
          currentPhase: 'game_over',
          log: [...state.log, 'End Game Card drawn! Final scoring...'],
        };
      }

      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex] = {
        ...player,
        territoryCards: [...player.territoryCards, drawn],
      };

      return {
        ...state,
        players: newPlayers,
        territoryCardDeck: newDeck,
        log: [...state.log, `${player.name} drew a Territory Card.`],
      };
    }

    case 'FINISH_DRAW': {
      // Check for end game card already in hand > 5 etc.
      return state;
    }

    case 'END_TURN': {
      // Check victory
      const winner = checkVictory(state);
      if (winner) {
        return {
          ...state,
          gameOver: true,
          winner,
          currentPhase: 'game_over',
          log: [...state.log, `${HOUSES[winner]?.name || winner} wins the game!`],
        };
      }

      // Next player
      let nextIdx = (state.currentPlayerIndex + 1) % state.players.length;
      while (state.players[nextIdx].eliminated) {
        nextIdx = (nextIdx + 1) % state.players.length;
      }

      const newRound = nextIdx <= state.currentPlayerIndex ? state.round + 1 : state.round;

      const nextState: GameState = {
        ...state,
        currentPlayerIndex: nextIdx,
        currentPhase: 'reinforce',
        selectedTerritory: null,
        targetTerritory: null,
        activeBattle: null,
        maneuverDone: false,
        round: newRound,
      };

      const reinforcements = calculateReinforcements(nextState);
      nextState.reinforcementsRemaining = reinforcements;

      // Reset conquest flag
      const newPlayers = [...nextState.players];
      newPlayers[nextIdx] = { ...newPlayers[nextIdx], conqueredThisTurn: false };
      nextState.players = newPlayers;

      nextState.log = [...state.log, `Round ${newRound}: ${newPlayers[nextIdx].name}'s turn.`];

      return nextState;
    }

    case 'TOGGLE_CARD_TRADE': {
      return { ...state, showCardTradePanel: !state.showCardTradePanel, selectedCards: [] };
    }

    case 'SELECT_CARD': {
      const selected = state.selectedCards.includes(action.cardId)
        ? state.selectedCards.filter(id => id !== action.cardId)
        : state.selectedCards.length < 3
          ? [...state.selectedCards, action.cardId]
          : state.selectedCards;
      return { ...state, selectedCards: selected };
    }

    case 'TRADE_CARDS': {
      const player = state.players[state.currentPlayerIndex];
      const cards = state.selectedCards.map(cid => player.territoryCards.find(c => c.id === cid)!).filter(Boolean);
      if (!isValidCardSet(cards)) return state;

      const bonusValues = [4, 6, 8, 10, 12, 15];
      const bonus = bonusValues[Math.min(state.cardSetTradeCount, bonusValues.length - 1)];

      // Check if player owns any territory on the traded cards
      let extraArmies = 0;
      const extraTerritories: string[] = [];
      for (const card of cards) {
        if (state.territories[card.territoryId]?.owner === player.id) {
          extraArmies += 2;
          extraTerritories.push(card.territoryId);
        }
      }

      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex] = {
        ...player,
        territoryCards: player.territoryCards.filter(c => !state.selectedCards.includes(c.id)),
      };

      // Apply extra armies to matching territories
      const newTerritories = { ...state.territories };
      for (const tid of extraTerritories) {
        newTerritories[tid] = { ...newTerritories[tid], armies: newTerritories[tid].armies + 2 };
      }

      return {
        ...state,
        players: newPlayers,
        territories: newTerritories,
        reinforcementsRemaining: state.reinforcementsRemaining + bonus,
        cardSetTradeCount: state.cardSetTradeCount + 1,
        selectedCards: [],
        showCardTradePanel: false,
        log: [...state.log,
          `${player.name} traded 3 cards for ${bonus} bonus armies.${extraArmies ? ` +${extraArmies} to owned territories.` : ''}`
        ],
      };
    }

    case 'CLEAR_SELECTION': {
      return { ...state, selectedTerritory: null, targetTerritory: null };
    }

    default:
      return state;
  }
}
