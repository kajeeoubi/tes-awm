const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Read .env.local manually to ensure variables are loaded
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        val = val.replace(/^["']|["']$/g, '').trim();
        process.env[key] = val;
      }
    });
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('ERROR: DATABASE_URL not found in .env.local');
  process.exit(1);
}

async function runSync() {
  console.log('Connecting to Supabase Database...');
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL successfully!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying schema migrations...');
    await client.query(sql);
    console.log('Schema synchronization completed successfully!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\nVerified Tables in public schema:');
    res.rows.forEach((r) => console.log(' - ' + r.table_name));

    // Verify products count
    const prodRes = await client.query('SELECT COUNT(*) FROM public.products;');
    console.log('\nTotal Products in Database:', prodRes.rows[0].count);

    // Verify vouchers count
    const vouchRes = await client.query('SELECT COUNT(*) FROM public.vouchers;');
    console.log('Total Vouchers in Database:', vouchRes.rows[0].count);

    // Verify admins count
    const adminRes = await client.query('SELECT COUNT(*) FROM public.admins;');
    console.log('Total Admins in Database:', adminRes.rows[0].count);

  } catch (err) {
    console.error('Database Sync Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSync();
