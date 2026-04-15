import { NextResponse } from 'next/server';
import { sql, initDB } from '../_db';

export async function GET(req: Request) {
  try {
    await initDB();
    const year = new URL(req.url).searchParams.get('year');
    if (!year) return NextResponse.json({ error: 'year required' }, { status: 400 });
    const { rows } = await sql`SELECT id, name, team_id as "teamId", hi FROM players WHERE year=${parseInt(year)} ORDER BY team_id, id`;
    return NextResponse.json(rows);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const { year, players } = await req.json();
    for (const p of players) {
      await sql`UPDATE players SET name=${p.name}, hi=${p.hi===''?null:p.hi} WHERE year=${year} AND id=${p.id}`;
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
