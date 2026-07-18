import Link from 'next/link';
export default function CreatureNotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="text-aged-gold-500 text-xs uppercase">
          Vestígio inconclusivo
        </p>
        <h1 className="font-display mt-4 text-5xl uppercase">
          Criatura não encontrada
        </h1>
        <Link
          className="border-aged-gold-500 mt-8 inline-block border-b pb-2 text-xs uppercase"
          href="/bestiario"
        >
          Retornar ao códice
        </Link>
      </div>
    </main>
  );
}
