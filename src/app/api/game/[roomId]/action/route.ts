import { NextRequest, NextResponse } from 'next/server';
import { handleGameAction } from '@/lib/gameEngine';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await request.json();
    const { playerId, action } = body;

    if (!playerId || !action) {
      return NextResponse.json({ error: 'playerId and action required' }, { status: 400 });
    }

    const result = handleGameAction(roomId, playerId, action);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
