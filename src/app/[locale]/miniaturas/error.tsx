'use client';
export default function MiniaturesError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto min-h-[70vh] max-w-3xl px-5 py-24">
      <h1 className="font-display text-5xl uppercase">
        O arquivo não respondeu
      </h1>
      <p className="mt-5">
        Nenhum arquivo privado foi afetado. Tente carregar os registros
        novamente.
      </p>
      <button
        className="border-aged-gold-500 mt-8 min-h-12 border px-6 uppercase"
        onClick={reset}
        type="button"
      >
        Tentar novamente
      </button>
    </main>
  );
}
