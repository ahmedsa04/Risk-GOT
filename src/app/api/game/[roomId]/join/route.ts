import { NextRequest, NextResponse } from 'next/server';
import { joinRoom, selectHouse, setStartingMethod, setMode, startGame, getRoom, getLobbyState, reconnectPlayer } from '@/lib/rooms';
import type { StartingMethod } from '@/lib/rooms';
import type { GameMode } from '@/app/game/reducer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'join': {
        const { nickname } = body;
        if (!nickname || typeof nickname !== 'string') {
          return NextResponse.json({ error: 'Nickname is required' }, { status: 400 });
        }
        const result = joinRoom(roomId, nickname);
        if ('error' in result) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json(result);
      }

      case 'select_house': {
        const { playerId, houseId } = body;
        if (!playerId || !houseId) {
          return NextResponse.json({ error: 'playerId and houseId required' }, { status: 400 });
        }
        const result = selectHouse(roomId, playerId, houseId);
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
      }

      case 'set_starting_method': {
        const { playerId, method } = body;
        if (!['random', 'seat_based'].includes(method)) {
          return NextResponse.json({ error: 'Invalid starting method' }, { status: 400 });
        }
        const result = setStartingMethod(roomId, playerId, method as StartingMethod);
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
      }

      case 'set_mode': {
        const { playerId, mode } = body;
        if (!['skirmish', 'dominion', 'world_at_war'].includes(mode)) {
          return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
        }
        const result = setMode(roomId, playerId, mode as GameMode);
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
      }

      case 'start': {
        const { playerId } = body;
        if (!playerId) {
          return NextResponse.json({ error: 'playerId required' }, { status: 400 });
        }
        const result = startGame(roomId, playerId);
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
      }

      case 'reconnect': {
        const { playerId } = body;
        if (!playerId) {
          return NextResponse.json({ error: 'playerId required' }, { status: 400 });
        }
        const ok = reconnectPlayer(roomId, playerId);
        if (!ok) {
          return NextResponse.json({ error: 'Could not reconnect' }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
      }

      case 'lobby': {
        const room = getRoom(roomId);
        if (!room) {
          return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }
        return NextResponse.json(getLobbyState(room));
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
