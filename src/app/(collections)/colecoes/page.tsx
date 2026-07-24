import type { Metadata } from 'next';
import { CanonicalArchive } from '@/components/shared/canonical-archive';
import { getCanonicalContentByType } from '@/content/canonical-content';

export const metadata: Metadata = {
  title: 'Coleções e miniaturas',
  description: 'Coleções editoriais canônicas de Asterheim.',
  alternates: { canonical: '/colecoes' },
};

export default function CollectionsPage() {
  const collections = getCanonicalContentByType('collection');
  return (
    <main
      className="entity-archive mx-auto max-w-[90rem] px-5 py-16 sm:px-8"
      id="main-content"
    >
      <header className="cinematic-page-header max-w-5xl py-14">
        <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
          Arquivo de formas
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] leading-[.85] uppercase">
          Coleções moldadas para a mesa
        </h1>
        <p className="text-parchment-200/60 mt-8 max-w-2xl text-lg">
          Coleções recuperadas da fonte editorial, ainda sem venda ou
          distribuição de arquivos privados.
        </p>
      </header>
      <div id="miniaturas">
        <CanonicalArchive
          records={collections}
          emptyMessage="Nenhuma coleção canônica está disponível."
        />
      </div>
    </main>
  );
}
