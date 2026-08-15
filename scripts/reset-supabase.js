const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL is not defined in .env.local');
  process.exit(1);
}

async function resetDatabase() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Connecting to Supabase Database...');
    await client.connect();
    console.log('Connected to Supabase PostgreSQL successfully!');

    console.log('Resetting and clearing tables (orders, order_items, vouchers, products)...');
    
    // Clear all tables with cascade
    await client.query(`
      TRUNCATE TABLE public.order_items, public.orders, public.vouchers, public.products RESTART IDENTITY CASCADE;
    `);

    console.log('Tables truncated successfully!');

    // Re-apply schema & initial seeds
    const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Re-applying schema and seed data...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await client.query(schemaSql);
      console.log('Schema & seed re-applied successfully!');
    }

    // Verify row counts
    const productsRes = await client.query('SELECT COUNT(*) FROM public.products;');
    const ordersRes = await client.query('SELECT COUNT(*) FROM public.orders;');
    const vouchersRes = await client.query('SELECT COUNT(*) FROM public.vouchers;');

    console.log('\n--- Status Database Setelah Reset ---');
    console.log(`Total Products: ${productsRes.rows[0].count}`);
    console.log(`Total Orders: ${ordersRes.rows[0].count}`);
    console.log(`Total Vouchers: ${vouchersRes.rows[0].count}`);
    console.log('-------------------------------------\n');

  } catch (err) {
    console.error('Database reset failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetDatabase();
