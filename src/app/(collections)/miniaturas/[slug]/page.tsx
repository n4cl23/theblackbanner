import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isRemovedDemoSlug } from '@/content/removed-demo-content';
import { LockedDownload } from '@/features/collections/components/locked-download';
import { getMiniaturePageData } from '@/features/collections/data/collection-repository';
import { mockMiniatures } from '@/features/collections/data/collections.mock';
import { ModelInspectorContract } from '@/features/bestiary/components/model-inspector-contract';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return mockMiniatures
    .filter(({ slug }) => !isRemovedDemoSlug(slug))
    .map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMiniaturePageData(slug);
  if (!data)
    return { title: 'Miniatura não encontrada', robots: { index: false } };
  return {
    title: `${data.miniature.title} — Miniatura`,
    description: `Ficha técnica provisória da miniatura ${data.miniature.title}.`,
    alternates: { canonical: `/miniaturas/${slug}` },
  };
}
export default async function MiniaturePage({ params }: Props) {
  const { slug } = await params;
  if (isRemovedDemoSlug(slug)) notFound();
  const data = await getMiniaturePageData(slug);
  if (!data) notFound();
  const { miniature, related, collections } = data;
  const dimensions = miniature.dimensionsMm;
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
      <nav
        aria-label="Breadcrumb"
        className="text-parchment-200/50 text-xs uppercase"
      >
        <Link href="/colecoes">Coleções</Link> / Miniaturas / {miniature.title}
      </nav>
      <header className="grid gap-10 py-20 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <p className="text-aged-gold-500 text-xs tracking-[.3em] uppercase">
            Ficha técnica · versão {miniature.version}
          </p>
          <h1 className="font-display mt-5 text-[clamp(3.5rem,8vw,7rem)] leading-[.86] uppercase">
            {miniature.title}
          </h1>
          <p className="text-parchment-200/60 mt-7 text-xl">
            Relacionada a {related?.title ?? 'entidade não catalogada'} ·{' '}
            {collections.map((item) => item.title).join(', ')}
          </p>
        </div>
        <LockedDownload
          descriptors={miniature.includedFileDescriptors}
          version={miniature.version}
        />
      </header>
      <section className="border-y border-stone-600/25 py-16">
        <h2 className="font-display text-4xl uppercase">Especificações</h2>
        <dl className="mt-10 grid gap-px bg-stone-600/25 sm:grid-cols-2 lg:grid-cols-4">
          <Spec label="Escala" value={miniature.scale} />
          <Spec label="Altura" value={`${dimensions.height} mm`} />
          <Spec label="Largura" value={`${dimensions.width} mm`} />
          <Spec label="Profundidade" value={`${dimensions.depth} mm`} />
          <Spec label="Peças" value={String(miniature.pieceCount)} />
          <Spec label="Suporte" value={miniature.support} />
          <Spec label="Base" value={miniature.base} />
          <Spec label="Material" value={miniature.suggestedMaterial} />
          <Spec label="Resolução" value={`${miniature.resolutionMicrons} μm`} />
          <Spec label="Orientação" value={miniature.orientation} />
          <Spec label="Dificuldade" value={miniature.difficulty} />
          <Spec label="Impressora alvo" value={miniature.targetPrinter} />
        </dl>
      </section>
      <section className="grid gap-10 py-20 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl uppercase">Inspeção 3D</h2>
          <p className="text-parchment-200/50 mt-4">
            Nenhum GLB de teste foi fornecido.
          </p>
          <div className="mt-7">
            <ModelInspectorContract asset={null} label={miniature.title} />
          </div>
        </div>
        <div>
          <h2 className="font-display text-4xl uppercase">Changelog</h2>
          <ol className="mt-7 border-l border-stone-600/30 pl-6">
            {miniature.changelog.map((entry) => (
              <li className="mb-7" key={`${entry.version}-${entry.date}`}>
                <p className="text-aged-gold-500 text-xs uppercase">
                  v{entry.version} · {entry.date}
                </p>
                <p className="mt-2">{entry.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-coal-950 min-h-32 p-5">
      <dt className="text-aged-gold-500 text-xs uppercase">{label}</dt>
      <dd className="mt-3">{value}</dd>
    </div>
  );
}
