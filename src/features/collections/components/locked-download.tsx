'use client';
import { useState } from 'react';
export function LockedDownload({
  version,
  descriptors,
}: {
  version: string;
  descriptors: readonly string[];
}) {
  const [explained, setExplained] = useState(false);
  return (
    <section className="border-aged-gold-500/30 bg-coal-900 border p-7">
      <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
        Pacote STL demonstrativo · v{version}
      </p>
      <ul className="text-parchment-200/60 mt-5 space-y-2">
        {descriptors.map((item) => (
          <li key={item}>— {item}</li>
        ))}
      </ul>
      <button
        aria-describedby="download-policy"
        className="mt-7 min-h-12 w-full cursor-not-allowed border border-stone-600/40 px-5 text-xs tracking-widest uppercase"
        onClick={() => setExplained(true)}
        type="button"
      >
        Download bloqueado
      </button>
      <p
        className="text-parchment-200/45 mt-4 text-sm"
        id="download-policy"
        role={explained ? 'status' : undefined}
      >
        {explained
          ? 'Nenhum arquivo privado ou URL direta existe nesta sprint.'
          : 'Interface demonstrativa. Distribuição privada será definida em sprint futura.'}
      </p>
    </section>
  );
}
