const fs = require('fs');
const path = require('path');

// Read the fix migration SQL file
const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20260211_fix_permissive_policies', 'migration.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Get database URL from environment
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function applyFix() {
    const pool = new Pool({
        connectionString: process.env.DIRECT_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔧 Fixing overly permissive RLS policies...\n');
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!\n');

        console.log('Applying fix migration...');
        await client.query(migrationSQL);

        console.log('\n✅ Fix migration applied successfully!\n');

        console.log('═══════════════════════════════════════════════════════');
        console.log('VERIFYING POLICY REMOVAL');
        console.log('═══════════════════════════════════════════════════════\n');

        // Check if problematic policies are gone
        const policies = await client.query(`
      SELECT tablename, policyname, cmd, qual, with_check
      FROM pg_policies 
      WHERE schemaname = 'public'
        AND tablename IN ('User', 'AuditLog')
      ORDER BY tablename, policyname;
    `);

        console.log('Current policies on User and AuditLog tables:\n');

        const userPolicies = policies.rows.filter(p => p.tablename === 'User');
        const auditPolicies = policies.rows.filter(p => p.tablename === 'AuditLog');

        console.log('User Table Policies:');
        if (userPolicies.length === 0) {
            console.log('  (No INSERT policies - Server-side only) ✅');
        } else {
            userPolicies.forEach(p => {
                const status = p.policyname === 'Enable insert for authentication' ? '❌ STILL EXISTS' : '✅';
                console.log(`  ${status} ${p.policyname} (${p.cmd})`);
            });
        }

        console.log('\nAuditLog Table Policies:');
        if (auditPolicies.filter(p => p.cmd === 'INSERT').length === 0) {
            console.log('  (No INSERT policies - Server-side only) ✅');
        } else {
            auditPolicies.forEach(p => {
                const status = p.policyname === 'Enable insert for system' ? '❌ STILL EXISTS' : '✅';
                console.log(`  ${status} ${p.policyname} (${p.cmd})`);
            });
        }

        // Check if the problematic policies still exist
        const problematicPolicies = policies.rows.filter(p =>
            (p.policyname === 'Enable insert for authentication' && p.tablename === 'User') ||
            (p.policyname === 'Enable insert for system' && p.tablename === 'AuditLog')
        );

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('SUMMARY');
        console.log('═══════════════════════════════════════════════════════\n');

        if (problematicPolicies.length === 0) {
            console.log('✅ All overly permissive policies have been removed!');
            console.log('🔒 User creation now restricted to authentication system');
            console.log('🔒 Audit log creation now restricted to server-side code\n');
        } else {
            console.log('⚠️  Warning: Some problematic policies still exist:');
            problematicPolicies.forEach(p => {
                console.log(`   - ${p.tablename}.${p.policyname}`);
            });
        }

        client.release();
    } catch (error) {
        console.error('❌ Error applying fix:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

applyFix();
