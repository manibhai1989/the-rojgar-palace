
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const job = await prisma.job.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    if (!job) {
        console.log("No jobs found.");
        return;
    }

    console.log("=== LATEST JOB ===");
    console.log("ID:", job.id);
    console.log("Title:", job.title);
    console.log("Application Process (JSON):", JSON.stringify(job.applicationProcess, null, 2));
    console.log("Eligibility (JSON):", JSON.stringify(job.eligibility, null, 2));
    console.log("Fees (JSON):", JSON.stringify(job.fees, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
