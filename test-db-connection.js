require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});

async function testConnection() {
    try {
        console.log('=== Testing Database Connection ===');
        console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
        if (process.env.DATABASE_URL) {
            const urlParts = process.env.DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)/);
            if (urlParts) {
                console.log('User:', urlParts[1]);
                console.log('Password length:', urlParts[2].length);
                console.log('Host:', urlParts[3]);
                console.log('Port:', urlParts[4]);
                console.log('Database:', urlParts[5]);
            }
        }

        console.log('\nTrying to connect...');
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Connection successful!', result);

        const userCount = await prisma.user.count();
        console.log(`✅ User count: ${userCount}`);

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Connection failed:');
        console.error('Error:', error.message);
        if (error.code) console.error('Code:', error.code);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
