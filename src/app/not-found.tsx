import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-screen max-w-4xl place-content-center px-5 py-24 text-center">
      <p className="text-aged-gold-500 text-xs tracking-[0.3em] uppercase">
        Erro 404 · caminho perdido
      </p>
      <h1 className="font-display mt-6 text-[clamp(4rem,12vw,9rem)] leading-none uppercase">
        Além do mapa
      </h1>
      <p className="text-parchment-200/65 mx-auto mt-7 max-w-xl">
        Este registro não existe, foi movido ou permanece oculto sob as cinzas.
      </p>
      <Link
        className="border-aged-gold-500/60 mx-auto mt-10 inline-flex min-h-12 items-center border px-7 text-xs tracking-widest uppercase"
        href="/"
      >
        Retornar a Asterheim
      </Link>
    </main>
  );
}
