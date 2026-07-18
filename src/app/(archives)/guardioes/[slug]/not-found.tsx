import Link from 'next/link';
export default function GuardianNotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="text-aged-gold-500 text-xs uppercase">
          O juramento não responde
        </p>
        <h1 className="font-display mt-4 text-5xl uppercase">
          Guardião não encontrado
        </h1>
        <Link
          className="border-aged-gold-500 mt-8 inline-block border-b pb-2 text-xs uppercase"
          href="/guardioes"
        >
          Retornar à ordem
        </Link>
      </div>
    </main>
  );
}
