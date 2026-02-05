
import prisma from "./src/lib/prisma";

async function main() {
    console.log("Checking DB...");
    const count = await prisma.job.count();
    console.log(`Total Jobs in DB: ${count}`);
    const jobs = await prisma.job.findMany({ select: { id: true, title: true } });
    console.log("Job IDs:", JSON.stringify(jobs, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
