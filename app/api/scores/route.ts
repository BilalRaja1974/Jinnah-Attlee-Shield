import { NextResponse } from 'next/server';
import { sql, initDB } from '../_db';

function toPgArray(arr: string[]): string {
  return '{' + arr.map(v => `"${v.replace(/"/g, '\\"')}"`).join(',') + '}';
}

export async function GET(req: Request) {
  try {
    await initDB();
    const year = new URL(req.url).searchParams.get('year');
    if (!year) return NextResponse.json({ error: 'year required' }, { status: 400 });
    const { rows } = await sql`SELECT id, day, match_index as "matchIndex", team_a as "teamA", team_b as "teamB", player_a as "playerA", player_b as "playerB" FROM pairings WHERE year=${parseInt(year)} ORDER BY day, match_index`;
    return NextResponse.json(rows);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const { year, pairings } = await req.json();
    for (const p of pairings) {
      if (p.day < 3) {
        const teamA = toPgArray(p.teamA || []);
        const teamB = toPgArray(p.teamB || []);
        await sql`UPDATE pairings SET team_a=${teamA}::text[], team_b=${teamB}::text[] WHERE year=${year} AND id=${p.id}`;
      } else {
        await sql`UPDATE pairings SET player_a=${p.playerA}, player_b=${p.playerB} WHERE year=${year} AND id=${p.id}`;
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
