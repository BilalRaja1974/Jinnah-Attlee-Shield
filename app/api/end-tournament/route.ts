import { NextResponse } from 'next/server';
import { sql, initDB } from '../_db';

export async function POST(req: Request) {
  try {
    await initDB();
    const { password, year, winner, tied, scoreA, scoreB, venue, matches } = await req.json();
    if (password !== 'Z@rminae2009') {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
    await sql`
      INSERT INTO completed_tournaments (year, winner, tied, score_a, score_b, venue, matches)
      VALUES (${year}, ${winner}, ${tied}, ${scoreA}, ${scoreB}, ${venue}, ${JSON.stringify(matches)}::jsonb)
      ON CONFLICT (year) DO UPDATE SET
        winner=${winner}, tied=${tied}, score_a=${scoreA}, score_b=${scoreB},
        venue=${venue}, matches=${JSON.stringify(matches)}::jsonb, completed_at=NOW()
    `;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
