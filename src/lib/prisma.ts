import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL || "";
const urlObj = databaseUrl ? new URL(databaseUrl.startsWith('postgresql://') ? databaseUrl : `postgresql://${databaseUrl}`) : null;
const host = urlObj ? urlObj.host : "UNKNOWN HOST";

if (process.env.NODE_ENV !== "production") {
    console.log(`[Prisma] Attempting initialization with host: ${host}`);
}




export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ["error", "warn"],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;


