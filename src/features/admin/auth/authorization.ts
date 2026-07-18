import { auth, currentUser } from '@clerk/nextjs/server';
import { AdminRole, type AdminUser } from '@/generated/prisma/client';
import { AuditAction, AuditResult } from '@/generated/prisma/client';
import { randomUUID } from 'node:crypto';
import { getPrismaClient } from '@/features/admin/persistence/prisma';

export type AdminCapability =
  | 'read'
  | 'create'
  | 'edit'
  | 'submit'
  | 'publish'
  | 'archive'
  | 'restore'
  | 'duplicate';
const capabilities: Record<AdminRole, readonly AdminCapability[]> = {
  ADMIN: [
    'read',
    'create',
    'edit',
    'submit',
    'publish',
    'archive',
    'restore',
    'duplicate',
  ],
  EDITOR: ['read', 'create', 'edit', 'submit', 'duplicate'],
  REVIEWER: ['read', 'publish', 'archive', 'restore'],
};
export function can(role: AdminRole, capability: AdminCapability) {
  return capabilities[role].includes(capability);
}

export async function requireAdminUser(
  capability: AdminCapability = 'read',
): Promise<AdminUser> {
  if (!process.env.CLERK_SECRET_KEY)
    throw new Error('Administrative authentication is not configured.');
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const identity = await currentUser();
  const email = identity?.primaryEmailAddress?.emailAddress;
  if (!email)
    throw new Error('Authenticated user has no verified primary email.');
  const prisma = getPrismaClient();
  let admin = await prisma.adminUser.findUnique({
    where: { externalAuthId: userId },
  });
  if (!admin) {
    admin = await prisma.$transaction(
      async (tx) => {
        const count = await tx.adminUser.count();
        const created = await tx.adminUser.create({
          data: {
            externalAuthId: userId,
            email,
            displayName: identity?.fullName ?? email,
            role: count === 0 ? AdminRole.ADMIN : AdminRole.EDITOR,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: created.id,
            action: AuditAction.LOGIN,
            origin: 'clerk-session-bootstrap',
            result: AuditResult.SUCCESS,
            requestId: randomUUID(),
          },
        });
        return created;
      },
      { isolationLevel: 'Serializable' },
    );
  }
  if (!admin.active || !can(admin.role, capability))
    throw new Error('Forbidden');
  return admin;
}
