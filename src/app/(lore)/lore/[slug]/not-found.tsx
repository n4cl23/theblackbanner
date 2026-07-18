import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-32">
      <h1 className="font-display text-6xl uppercase">
        Registro não encontrado
      </h1>
      <Link className="mt-8 inline-block underline" href="/lore">
        Voltar ao códice
      </Link>
    </main>
  );
}
