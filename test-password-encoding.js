require('dotenv').config({ path: '.env.local' });

// Simple password encoding test
const password = 'ArTi1989%$#@**';
const encoded = encodeURIComponent(password);

console.log('Original password:', password);
console.log('URL-encoded password:', encoded);

const dbUrl = `postgresql://postgres:${encoded}@db.mcryxbvedntuhazozrif.supabase.co:6543/postgres?pgbouncer=true`;
console.log('\nConstructed URL:', dbUrl);

process.env.DATABASE_URL = dbUrl;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['error'] });

async function test() {
    try {
        console.log('\nTesting connection...');
        await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

test();
