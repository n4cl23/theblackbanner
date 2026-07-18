'use client';
import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import { logoutAudit } from '@/features/admin/actions/content-actions';
export function AdminLogout() {
  const clerk = useClerk();
  const [pending, setPending] = useState(false);
  async function logout() {
    setPending(true);
    await logoutAudit();
    await clerk.signOut({ redirectUrl: '/' });
  }
  return (
    <button
      className="text-xs uppercase disabled:opacity-50"
      disabled={pending}
      onClick={logout}
      type="button"
    >
      {pending ? 'Saindo…' : 'Sair'}
    </button>
  );
}
