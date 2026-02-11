const fs = require('fs');
const path = require('path');

// Get database URL from environment
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function verifyRLS() {
    const pool = new Pool({
        connectionString: process.env.DIRECT_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔍 Verifying Row Level Security Setup...\n');
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!\n');

        // Verify RLS is enabled
        console.log('═══════════════════════════════════════════════════════');
        console.log('TABLE RLS STATUS');
        console.log('═══════════════════════════════════════════════════════\n');

        const rlsStatus = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `);

        console.log('Table Name                | RLS Enabled');
        console.log('--------------------------|-------------');
        let allEnabled = true;
        rlsStatus.rows.forEach(row => {
            const status = row.rowsecurity ? '✅ Yes' : '❌ No';
            if (!row.rowsecurity) allEnabled = false;
            console.log(`${row.tablename.padEnd(25)} | ${status}`);
        });

        if (allEnabled) {
            console.log('\n✅ All tables have RLS enabled!\n');
        } else {
            console.log('\n⚠️  Some tables do not have RLS enabled!\n');
        }

        // Verify policies exist
        console.log('═══════════════════════════════════════════════════════');
        console.log('SECURITY POLICIES');
        console.log('═══════════════════════════════════════════════════════\n');

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

        const totalPolicies = policies.rows.reduce((sum, row) => sum + parseInt(row.policy_count), 0);
        console.log('--------------------------|-------------');
        console.log(`${'TOTAL'.padEnd(25)} | ${totalPolicies}\n`);

        // Check for tables with sensitive data
        console.log('═══════════════════════════════════════════════════════');
        console.log('SENSITIVE DATA PROTECTION STATUS');
        console.log('═══════════════════════════════════════════════════════\n');

        const sensitiveTables = [
            { table: 'User', reason: 'Contains emails, 2FA secrets' },
            { table: 'Account', reason: 'Contains OAuth tokens' },
            { table: 'Session', reason: 'Contains session tokens' },
            { table: 'AuditLog', reason: 'Contains IP addresses, user agents' },
            { table: 'Profile', reason: 'Contains personal information' }
        ];

        for (const { table, reason } of sensitiveTables) {
            const tableRLS = rlsStatus.rows.find(r => r.tablename === table);
            const tablePolicies = policies.rows.find(r => r.tablename === table);

            const rlsEnabled = tableRLS && tableRLS.rowsecurity;
            const policyCount = tablePolicies ? tablePolicies.policy_count : 0;

            const status = rlsEnabled && policyCount > 0 ? '✅ PROTECTED' : '❌ VULNERABLE';
            console.log(`${table.padEnd(20)} | ${status}`);
            console.log(`${''.padEnd(20)} | ${reason}`);
            console.log(`${''.padEnd(20)} | RLS: ${rlsEnabled ? 'Yes' : 'No'} | Policies: ${policyCount}`);
            console.log('');
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log('SUMMARY');
        console.log('═══════════════════════════════════════════════════════\n');

        console.log(`✅ Total tables: ${rlsStatus.rows.length}`);
        console.log(`✅ Tables with RLS enabled: ${rlsStatus.rows.filter(r => r.rowsecurity).length}`);
        console.log(`✅ Total security policies: ${totalPolicies}`);
        console.log(`✅ Tables with policies: ${policies.rows.length}`);

        const allSecure = allEnabled && totalPolicies > 0;

        if (allSecure) {
            console.log('\n🔒 ✅ DATABASE IS FULLY SECURED WITH ROW LEVEL SECURITY!');
            console.log('🎉 All sensitive data is now protected!\n');
        } else {
            console.log('\n⚠️  DATABASE SECURITY NEEDS ATTENTION!\n');
        }

        client.release();
    } catch (error) {
        console.error('❌ Error verifying RLS:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

verifyRLS();
