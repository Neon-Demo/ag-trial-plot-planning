import { PrismaClient } from "@prisma/client";

// To avoid instantiating multiple PrismaClient instances during hot reloading in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;