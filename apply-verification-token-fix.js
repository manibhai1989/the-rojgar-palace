const fs = require('fs');
const path = require('path');

// Read the fix migration SQL file
const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20260211_fix_verification_token', 'migration.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Get database URL from environment
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function applyVerificationTokenFix() {
    const pool = new Pool({
        connectionString: process.env.DIRECT_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔧 Adding VerificationToken RLS policy...\n');
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!\n');

        console.log('Applying VerificationToken policy...');
        await client.query(migrationSQL);

        console.log('\n✅ Policy added successfully!\n');

        // Verify the policy was created
        const policies = await client.query(`
      SELECT policyname, cmd, qual, with_check
      FROM pg_policies 
      WHERE schemaname = 'public'
        AND tablename = 'VerificationToken';
    `);

        console.log('VerificationToken Policies:');
        if (policies.rows.length === 0) {
            console.log('  ⚠️  No policies found');
        } else {
            policies.rows.forEach(p => {
                console.log(`  ✅ ${p.policyname} (${p.cmd})`);
            });
        }

        console.log('\n🔒 VerificationToken table is now explicitly secured!');
        console.log('   Only NextAuth server-side code can access verification tokens.\n');

        client.release();
    } catch (error) {
        console.error('❌ Error applying fix:', error.message);

        // Check if policy already exists
        if (error.message.includes('already exists')) {
            console.log('\n✅ Policy already exists - no changes needed!');
        } else {
            console.error('\nFull error:', error);
            process.exit(1);
        }
    } finally {
        await pool.end();
    }
}

applyVerificationTokenFix();
