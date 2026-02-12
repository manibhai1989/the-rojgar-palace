import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':****@'));

    try {
        // Test basic connection
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Database connection successful:', result);

        // Test User table
        const userCount = await prisma.user.count();
        console.log('✅ User table accessible, count:', userCount);

        // Test Job table
        const jobCount = await prisma.job.count();
        console.log('✅ Job table accessible, count:', jobCount);

        console.log('\n🎉 All database tests passed!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
