import Link from 'next/link';
export default function MiniatureNotFound() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-3xl px-5 py-24">
      <h1 className="font-display text-5xl uppercase">
        Miniatura não encontrada
      </h1>
      <p className="mt-5">
        O slug não corresponde a um registro publicado neste idioma.
      </p>
      <Link
        className="text-aged-gold-500 mt-8 inline-block"
        href="/pt-br/miniaturas"
      >
        Voltar ao arquivo
      </Link>
    </main>
  );
}
