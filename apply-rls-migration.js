const fs = require('fs');
const path = require('path');

// Read the migration SQL file
const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20260211_enable_rls', 'migration.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Get database URL from environment
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function applyMigration() {
    const pool = new Pool({
        connectionString: process.env.DIRECT_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Connected successfully!');

        console.log('\nApplying RLS migration...');
        await client.query(migrationSQL);

        console.log('\n✅ Migration applied successfully!');
        console.log('\nVerifying RLS is enabled on all tables...\n');

        // Verify RLS is enabled
        const result = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `);

        console.log('Table Name                | RLS Enabled');
        console.log('--------------------------|-------------');
        result.rows.forEach(row => {
            const status = row.rowsecurity ? '✅ Yes' : '❌ No';
            console.log(`${row.tablename.padEnd(25)} | ${status}`);
        });

        console.log('\n\nVerifying policies were created...\n');

        // Verify policies exist
        const policies = await client.query(`
      SELECT tablename, COUNT(*) as policy_count
      FROM pg_policies 
      WHERE schemaname = 'public'
      GROUP BY tablename
      ORDER BY tablename;
    `);

        console.log('Table Name                | Policy Count');
        console.log('--------------------------|-------------');
        policies.rows.forEach(row => {
            console.log(`${row.tablename.padEnd(25)} | ${row.policy_count}`);
        });

        console.log('\n✅ All Row Level Security policies have been applied successfully!');
        console.log('🔒 Your database is now secured with RLS protection.');

        client.release();
    } catch (error) {
        console.error('❌ Error applying migration:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

applyMigration();
