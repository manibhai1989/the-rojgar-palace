import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL || "";
const sanitizedUrl = databaseUrl.replace(/:([^@]+)@/, ":****@");

if (process.env.NODE_ENV !== "production") {
    console.log(`[Prisma] Initializing client with: ${sanitizedUrl || "MISSING DATABASE_URL"}`);
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

