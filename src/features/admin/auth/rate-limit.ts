import { getPrismaClient } from '@/features/admin/persistence/prisma';
export async function enforceAdminRateLimit(actorId: string) {
  const prisma = getPrismaClient();
  const key = `admin-action:${actorId}`;
  const now = new Date();
  const windowEnds = new Date(now.getTime() + 60_000);
  const bucket = await prisma.$transaction(async (tx) => {
    const current = await tx.rateLimitBucket.findUnique({ where: { key } });
    if (!current || current.windowEnds <= now)
      return tx.rateLimitBucket.upsert({
        where: { key },
        create: { key, attempts: 1, windowEnds },
        update: { attempts: 1, windowEnds },
      });
    return tx.rateLimitBucket.update({
      where: { key },
      data: { attempts: { increment: 1 } },
    });
  });
  if (bucket.attempts > 60)
    throw new Error('Muitas ações em pouco tempo. Aguarde um minuto.');
}
