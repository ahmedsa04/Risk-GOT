import { NextRequest } from 'next/server';
import { getRoom, addSSEConnection, removeSSEConnection, getLobbyState, broadcastLobby } from '@/lib/rooms';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const playerId = request.nextUrl.searchParams.get('playerId');

  if (!playerId) {
    return new Response('playerId required', { status: 400 });
  }

  const room = getRoom(roomId);
  if (!room) {
    return new Response('Room not found', { status: 404 });
  }

  const player = room.players.find(p => p.playerId === playerId);
  if (!player) {
    return new Response('Player not in room', { status: 403 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Register this SSE connection
      addSSEConnection(roomId, playerId, controller);

      // Send initial state
      const msg = `event: connected\ndata: ${JSON.stringify({ playerId })}\n\n`;
      controller.enqueue(new TextEncoder().encode(msg));

      // Send current lobby state
      const lobbyMsg = `event: lobby\ndata: ${JSON.stringify(getLobbyState(room))}\n\n`;
      controller.enqueue(new TextEncoder().encode(lobbyMsg));

      // If game already started, send game state
      if (room.started && room.gameState) {
        const gameMsg = `event: game_state\ndata: ${JSON.stringify(room.gameState)}\n\n`;
        controller.enqueue(new TextEncoder().encode(gameMsg));
      }

      // Broadcast updated lobby (so others see this player as connected)
      broadcastLobby(room);
    },
    cancel() {
      removeSSEConnection(roomId, playerId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
