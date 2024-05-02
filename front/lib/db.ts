import { PrismaClient } from "@prisma/client";

/**
 * The global object used to store the Prisma client instance.
 */
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * The Prisma client instance used to interact with the database.
 * If the instance is already available in the global object, it is used.
 * Otherwise, a new instance is created and stored in the global object.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

/**
 * If the environment is not production, the Prisma client instance is stored in the global object.
 * This allows reusing the same instance across multiple requests during development.
 */
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
