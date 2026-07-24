import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured.');
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const secureUrl = new URL(connectionString);
  secureUrl.searchParams.set('sslmode', 'verify-full');
  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString: secureUrl.toString() }),
  });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  return client;
}
