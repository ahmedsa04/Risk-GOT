import { NextRequest, NextResponse } from 'next/server';
import { createRoom } from '@/lib/rooms';
import type { GameMode } from '@/app/game/reducer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mode: GameMode = body.mode || 'skirmish';

    if (!['skirmish', 'dominion', 'world_at_war'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    const { roomId } = createRoom(mode);
    return NextResponse.json({ roomId });
  } catch {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
