import { NextResponse } from 'next/server';
import { sql, initDB } from '../_db';

export async function GET() {
  await initDB();
  const { rows } = await sql`SELECT id, day, match_index as "matchIndex", team_a as "teamA", team_b as "teamB", player_a as "playerA", player_b as "playerB" FROM pairings ORDER BY day, match_index`;
  return NextResponse.json(rows);
}

// Convert a JS string array to a Postgres array literal e.g. {"p1","p2"}
function toPgArray(arr: string[]): string {
  return '{' + arr.map(v => `"${v.replace(/"/g, '\\"')}"`).join(',') + '}';
}

export async function POST(req: Request) {
  await initDB();
  const pairings = await req.json();
  for (const p of pairings) {
    if (p.day < 3) {
      const teamA = toPgArray(p.teamA || []);
      const teamB = toPgArray(p.teamB || []);
      await sql`
        UPDATE pairings SET team_a = ${teamA}::text[], team_b = ${teamB}::text[]
        WHERE id = ${p.id}
      `;
    } else {
      await sql`
        UPDATE pairings SET player_a = ${p.playerA}, player_b = ${p.playerB}
        WHERE id = ${p.id}
      `;
    }
  }
  return NextResponse.json({ ok: true });
}
