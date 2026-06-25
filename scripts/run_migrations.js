import fs from 'fs/promises';
import path from 'path';
import pg from 'pg';

const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL;

if (!SUPABASE_DB_URL) {
  console.error('SUPABASE_DB_URL must be set in the environment. Example: postgres://user:pass@host:5432/postgres');
  process.exit(1);
}

const migrationsDir = path.resolve(process.cwd(), 'supabase', 'migrations');

async function run() {
  const client = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await client.connect();
  try {
    const files = (await fs.readdir(migrationsDir)).filter(f => f.endsWith('.sql')).sort();
    console.log(`Found ${files.length} migration files.`);
    for (const file of files) {
      const fp = path.join(migrationsDir, file);
      const sql = await fs.readFile(fp, 'utf8');
      console.log(`Running migration: ${file}`);
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`Applied ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Migration ${file} failed:`, err.message || err);
        throw err;
      }
    }
    console.log('All migrations applied successfully.');
  } finally {
    await client.end();
  }
}

run().catch(err => { console.error('Migration run failed:', err); process.exit(1); });
