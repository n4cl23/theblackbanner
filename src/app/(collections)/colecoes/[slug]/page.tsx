import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { absoluteUrl } from '@/config/site';
import { getContentRepository } from '@/features/content/repository/repository';
import { getCollectionPageData } from '@/features/collections/data/collection-repository';
import { isRemovedDemoSlug } from '@/content/removed-demo-content';
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await (await getContentRepository()).getCollections())
    .filter(({ slug }) => !isRemovedDemoSlug(slug))
    .map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollectionPageData(slug);
  if (!data)
    return { title: 'Coleção não encontrada', robots: { index: false } };
  return {
    title: data.collection.seo.title,
    description: data.collection.seo.description,
    alternates: { canonical: `/colecoes/${slug}` },
    openGraph: {
      title: data.collection.title,
      description: data.collection.excerpt,
      images: data.presentation ? [{ url: data.presentation.banner }] : [],
    },
  };
}
export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  if (isRemovedDemoSlug(slug)) notFound();
  const data = await getCollectionPageData(slug);
  if (!data || !data.presentation) notFound();
  const { collection, presentation, miniatures, included, related } = data;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: collection.title,
      description: collection.excerpt,
      url: absoluteUrl(`/colecoes/${collection.slug}`),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: miniatures.length,
        itemListElement: miniatures.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: absoluteUrl(`/miniaturas/${item.slug}`),
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Coleções',
          item: absoluteUrl('/colecoes'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: collection.title,
          item: absoluteUrl(`/colecoes/${collection.slug}`),
        },
      ],
    },
  ];
  return (
    <main>
      <JsonLd data={schemas} />
      <section className="relative min-h-[82vh] overflow-hidden">
        <Image
          alt={`Banner provisório de ${collection.title}`}
          className="object-cover opacity-65"
          fill
          priority
          sizes="100vw"
          src={presentation.banner}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-[90rem] flex-col justify-end px-5 py-16 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="text-parchment-200/55 text-xs uppercase"
          >
            <Link href="/colecoes">Coleções</Link> / {collection.title}
          </nav>
          <p className="text-aged-gold-500 mt-20 text-xs tracking-[.3em] uppercase">
            {presentation.category} · estudo provisório
          </p>
          <h1 className="font-display mt-5 max-w-5xl text-[clamp(4rem,10vw,8rem)] leading-[.84] uppercase">
            {collection.title}
          </h1>
          <p className="text-parchment-200/70 mt-7 max-w-2xl text-xl">
            {presentation.identity}
          </p>
        </div>
      </section>
      <CollectionSection label="Identidade" title="História da coleção">
        <div>
          {presentation.history.map((text) => (
            <p
              className="text-parchment-200/65 text-xl leading-relaxed"
              key={text}
            >
              {text}
            </p>
          ))}
        </div>
      </CollectionSection>
      <CollectionSection label="Conteúdo" title="Incluído">
        <Grid
          items={included.map((item) => ({
            title: item.title,
            detail: item.kind,
          }))}
        />
      </CollectionSection>
      <CollectionSection label="Formas" title="Miniaturas">
        <div className="grid gap-5 md:grid-cols-2">
          {miniatures.map((item) => (
            <Link
              className="bg-coal-900 border border-stone-600/30 p-7"
              href={`/pt-br/miniaturas/${item.slug}`}
              key={item.id}
            >
              <p className="text-aged-gold-500 text-xs uppercase">
                {item.scale} · {item.pieceCount} peças
              </p>
              <h3 className="font-display mt-4 text-3xl">{item.title}</h3>
              <p className="text-parchment-200/50 mt-3">
                {item.difficulty} · {item.support}
              </p>
            </Link>
          ))}
        </div>
      </CollectionSection>
      <CollectionSection label="Escala" title="Formatos disponíveis">
        <Grid
          items={presentation.scales.map((scale) => ({
            title: scale,
            detail: 'Escala de apresentação mock',
          }))}
        />
      </CollectionSection>
      <CollectionSection label="Galeria" title="Estudos visuais">
        <div className="relative aspect-video overflow-hidden border border-stone-600/30">
          <Image
            alt={`Galeria provisória de ${collection.title}`}
            className="object-cover opacity-60"
            fill
            sizes="70vw"
            src={presentation.banner}
          />
        </div>
      </CollectionSection>
      <CollectionSection label="Movimento" title="Vídeos">
        <EmptySlot text="Slot de vídeo preparado · nenhuma mídia oficial" />
      </CollectionSection>
      <CollectionSection label="Fabricação" title="Recomendações de impressão">
        <ul className="space-y-4">
          {presentation.printingNotes.map((note) => (
            <li className="border-l border-stone-600/30 pl-5" key={note}>
              {note}
            </li>
          ))}
        </ul>
        <Link
          className="text-aged-gold-500 mt-8 inline-block border-b pb-2 text-xs uppercase"
          href="/guia-de-impressao"
        >
          Abrir guia completo
        </Link>
      </CollectionSection>
      <CollectionSection label="Ecos" title="Modelos relacionados">
        <Grid
          items={related.map((item) => ({
            title: item.title,
            detail: item.excerpt,
          }))}
        />
      </CollectionSection>
    </main>
  );
}
function CollectionSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-stone-600/20">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.5fr_1.5fr]">
        <header>
          <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
            {label}
          </p>
          <h2 className="font-display mt-3 text-4xl uppercase">{title}</h2>
        </header>
        <div>{children}</div>
      </div>
    </section>
  );
}
function Grid({
  items,
}: {
  items: readonly { title: string; detail: string }[];
}) {
  return items.length ? (
    <div className="grid gap-px bg-stone-600/25 sm:grid-cols-2">
      {items.map((item) => (
        <article className="bg-coal-950 min-h-36 p-6" key={item.title}>
          <h3 className="font-display text-2xl">{item.title}</h3>
          <p className="text-parchment-200/50 mt-3 text-sm">{item.detail}</p>
        </article>
      ))}
    </div>
  ) : (
    <EmptySlot text="Nenhum registro relacionado" />
  );
}
function EmptySlot({ text }: { text: string }) {
  return (
    <div className="text-parchment-200/40 grid min-h-40 place-items-center border border-dashed border-stone-600/30">
      {text}
    </div>
  );
}
