import { sql } from '@vercel/postgres';

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      team_id TEXT NOT NULL,
      hi NUMERIC
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS courses (
      day INTEGER PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      tees TEXT NOT NULL DEFAULT '',
      slope INTEGER NOT NULL DEFAULT 113,
      cr NUMERIC,
      par INTEGER NOT NULL DEFAULT 72,
      holes JSONB NOT NULL DEFAULT '[]'
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS pairings (
      id TEXT PRIMARY KEY,
      day INTEGER NOT NULL,
      match_index INTEGER NOT NULL,
      team_a TEXT[] DEFAULT '{}',
      team_b TEXT[] DEFAULT '{}',
      player_a TEXT DEFAULT '',
      player_b TEXT DEFAULT ''
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS scores (
      score_key TEXT PRIMARY KEY,
      holes JSONB NOT NULL DEFAULT '[]'
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS setup (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  // Seed players if table is empty
  const { rows } = await sql`SELECT COUNT(*) as c FROM players`;
  if (parseInt(rows[0].c) === 0) {
    const pakIds = Array.from({ length: 10 }, (_, i) => `p${i + 1}`);
    const engIds = Array.from({ length: 10 }, (_, i) => `p${i + 11}`);
    for (const id of pakIds) {
      await sql`INSERT INTO players (id, name, team_id, hi) VALUES (${id}, '', 'A', NULL) ON CONFLICT DO NOTHING`;
    }
    for (const id of engIds) {
      await sql`INSERT INTO players (id, name, team_id, hi) VALUES (${id}, '', 'B', NULL) ON CONFLICT DO NOTHING`;
    }
  }

  // Seed courses if empty
  const { rows: cr } = await sql`SELECT COUNT(*) as c FROM courses`;
  if (parseInt(cr[0].c) === 0) {
    const defaultHoles = JSON.stringify(
      Array.from({ length: 18 }, (_, i) => ({
        hole: i + 1,
        par: [4,4,3,4,5,3,4,4,4,4,4,3,4,5,3,4,4,5][i],
        si: i + 1,
      }))
    );
    for (const day of [1, 2, 3]) {
      await sql`INSERT INTO courses (day, name, tees, slope, cr, par, holes) VALUES (${day}, '', '', 113, NULL, 72, ${defaultHoles}::jsonb) ON CONFLICT DO NOTHING`;
    }
  }

  // Seed pairings if empty
  const { rows: pr } = await sql`SELECT COUNT(*) as c FROM pairings`;
  if (parseInt(pr[0].c) === 0) {
    for (let i = 0; i < 5; i++) {
      await sql`INSERT INTO pairings (id, day, match_index, team_a, team_b) VALUES (${`d1m${i}`}, 1, ${i}, '{}', '{}') ON CONFLICT DO NOTHING`;
      await sql`INSERT INTO pairings (id, day, match_index, team_a, team_b) VALUES (${`d2m${i}`}, 2, ${i}, '{}', '{}') ON CONFLICT DO NOTHING`;
    }
    for (let i = 0; i < 10; i++) {
      await sql`INSERT INTO pairings (id, day, match_index, player_a, player_b) VALUES (${`d3m${i}`}, 3, ${i}, '', '') ON CONFLICT DO NOTHING`;
    }
  }
}

export { sql };
