import { NextResponse } from 'next/server';
import { sql, initDB } from '@/lib/db';

export async function GET() {
  await initDB();
  const { rows } = await sql`SELECT id, name, team_id as "teamId", hi FROM players ORDER BY team_id, id`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await initDB();
  const players = await req.json();
  for (const p of players) {
    await sql`
      UPDATE players SET name = ${p.name}, hi = ${p.hi === '' ? null : p.hi}
      WHERE id = ${p.id}
    `;
  }
  return NextResponse.json({ ok: true });
}
