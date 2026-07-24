import Link from 'next/link';

export default function KingdomNotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
          Arquivo ausente
        </p>
        <h1 className="font-display mt-4 text-5xl uppercase">
          Reino não encontrado
        </h1>
        <p className="text-parchment-200/60 mt-5">
          Este slug não corresponde a um território catalogado.
        </p>
        <Link
          className="border-aged-gold-500 mt-8 inline-block border-b pb-2 text-xs uppercase"
          href="/world/kingdoms"
        >
          Voltar aos reinos
        </Link>
      </div>
    </main>
  );
}
