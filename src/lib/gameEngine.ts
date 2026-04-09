// ─── Server-side Game Engine ─────────────────────────────────────────────────
// Wraps the existing gameReducer with server-side validation and room context.
// Applies actions only from the correct player, broadcasts state after each action.

import { getRoom, broadcastGameState, getPlayerHouseId } from './rooms';
import { GameAction, GameState, gameReducer } from '../app/game/reducer';

export interface ActionRequest {
  playerId: string;
  action: GameAction;
}

// Actions that only the current-turn player can perform
const TURN_ACTIONS = new Set([
  'SELECT_TERRITORY',
  'DEPLOY_ARMY',
  'FINISH_REINFORCE',
  'SET_ATTACK_ARMIES',
  'INITIATE_ATTACK',
  'ROLL_DICE',
  'CONTINUE_BATTLE',
  'END_INVASION',
  'FINISH_INVADE',
  'SET_MOVE_COUNT',
  'MANEUVER',
  'FINISH_MANEUVER',
  'DRAW_CARD',
  'END_TURN',
  'TOGGLE_CARD_TRADE',
  'SELECT_CARD',
  'TRADE_CARDS',
  'MOVE_ARMIES_IN',
  'FINISH_DRAW',
  'CLEAR_SELECTION',
]);

export function handleGameAction(
  roomId: string,
  playerId: string,
  action: GameAction
): { error?: string; state?: GameState } {
  const room = getRoom(roomId);
  if (!room) return { error: 'Room not found' };
  if (!room.started || !room.gameState) return { error: 'Game not started' };

  const houseId = getPlayerHouseId(roomId, playerId);
  if (!houseId) return { error: 'Player not in room' };

  // Validate turn-based actions
  if (TURN_ACTIONS.has(action.type)) {
    const currentPlayer = room.gameState.players[room.gameState.currentPlayerIndex];
    if (currentPlayer.id !== houseId) {
      return { error: 'Not your turn' };
    }
  }

  // Skip hover actions from non-current player (they're per-client, don't broadcast)
  if (action.type === 'HOVER_TERRITORY') {
    // Hover is client-local, don't process server-side
    return { state: room.gameState };
  }

  // Apply action through the existing reducer
  const newState = gameReducer(room.gameState, action);
  room.gameState = newState;

  // Broadcast updated state to all connected players
  broadcastGameState(room);

  return { state: newState };
}
