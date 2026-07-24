import Link from 'next/link';
export default function CharacterNotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
          Registro ausente
        </p>
        <h1 className="font-display mt-4 text-5xl uppercase">
          Personagem não encontrado
        </h1>
        <Link
          className="border-aged-gold-500 mt-8 inline-block border-b pb-2 text-xs uppercase"
          href="/personagens"
        >
          Voltar ao arquivo
        </Link>
      </div>
    </main>
  );
}
