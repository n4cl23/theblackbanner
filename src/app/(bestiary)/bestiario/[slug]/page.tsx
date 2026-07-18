import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContentRepository } from '@/features/content/repository/repository';
import { FieldGallery } from '@/features/bestiary/components/field-gallery';
import { ModelInspectorContract } from '@/features/bestiary/components/model-inspector-contract';
import { getCreaturePageData } from '@/features/bestiary/data/bestiary-repository';
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await (await getContentRepository()).getCreatures()).map(
    ({ slug }) => ({ slug }),
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCreaturePageData(slug);
  if (!data)
    return { title: 'Criatura não encontrada', robots: { index: false } };
  const image = data.presentation?.evidence[0]?.image;
  return {
    title: data.creature.seo.title,
    description: data.creature.seo.description,
    alternates: { canonical: `/bestiario/${slug}` },
    openGraph: {
      title: data.creature.title,
      description: data.creature.excerpt,
      type: 'article',
      images: image ? [{ url: image }] : [],
    },
  };
}
export default async function CreaturePage({ params }: Props) {
  const { slug } = await params;
  const data = await getCreaturePageData(slug);
  if (!data || !data.presentation) notFound();
  const {
    creature,
    presentation,
    kingdoms,
    regions,
    relationships,
    characters,
    collections,
    profiles,
    related,
  } = data;
  const hero =
    presentation.evidence[0]?.image ?? '/images/home/bestiary-ruins.webp';
  return (
    <main>
      <section className="relative min-h-[86vh] overflow-hidden">
        <Image
          alt={`Habitat provisório de ${creature.title}`}
          className="object-cover opacity-65"
          fill
          priority
          sizes="100vw"
          src={hero}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#030303_8%,transparent_65%,#030303),linear-gradient(to_top,#030303,transparent_60%)]" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-[90rem] flex-col justify-end px-5 py-14 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="text-parchment-200/55 text-xs uppercase"
          >
            <Link href="/bestiario">Bestiário</Link> / {creature.title}
          </nav>
          <div className="max-w-5xl pt-32">
            <p className="text-aged-gold-500 text-xs tracking-[.32em] uppercase">
              {presentation.category} · {presentation.documentationStatus}
            </p>
            <h1 className="font-display mt-5 text-[clamp(4rem,11vw,9rem)] leading-[.82] uppercase">
              {creature.title}
            </h1>
            <p className="text-parchment-200/65 mt-7 text-xl">
              {creature.classification} · ameaça {creature.threatLevel}
            </p>
          </div>
        </div>
      </section>
      <CodexSection label="Classificação" title="Taxonomia">
        <div className="grid gap-6 md:grid-cols-2">
          <dl className="grid grid-cols-2 gap-4">
            <Fact
              label="Reino"
              value={kingdoms.map((item) => item.title).join(', ')}
            />
            <Fact
              label="Habitat"
              value={regions.map((item) => item.title).join(', ')}
            />
            <Fact label="Ameaça" value={creature.threatLevel} />
            <Fact label="Tamanho" value={presentation.size} />
            <Fact label="Raridade" value={presentation.rarity} />
            <Fact
              label="Documentação"
              value={presentation.documentationStatus}
            />
          </dl>
          <ol className="border-l border-stone-600/30 pl-6">
            {presentation.taxonomy.map((rank, index) => (
              <li className="font-display mb-5 text-2xl" key={rank}>
                <span className="text-aged-gold-500 mr-4 text-xs">
                  0{index + 1}
                </span>
                {rank}
              </li>
            ))}
          </ol>
        </div>
      </CodexSection>
      <CodexSection label="Anatomia" title="Descrição física">
        <p className="text-parchment-200/70 max-w-3xl text-xl leading-relaxed">
          {presentation.physical}
        </p>
      </CodexSection>
      <CodexSection label="Etologia" title="Comportamento e dieta">
        <div className="grid gap-8 md:grid-cols-2">
          <TextBlock title="Comportamento" text={presentation.behavior} />
          <TextBlock title="Dieta" text={presentation.diet} />
        </div>
      </CodexSection>
      <CodexSection label="Sobrevivência" title="Capacidades e fraquezas">
        <div className="grid gap-px bg-stone-600/25 md:grid-cols-2">
          <ListBlock title="Capacidades" items={presentation.abilities} />
          <ListBlock title="Fraquezas" items={presentation.weaknesses} />
        </div>
      </CodexSection>
      <CodexSection label="Campo" title="Evidências e relatos">
        <FieldGallery items={presentation.evidence} />
        <blockquote className="border-aged-gold-500/40 mt-12 border-l pl-7">
          {presentation.fieldReports.map((report) => (
            <p
              className="font-subtitle text-parchment-200/65 mb-4 text-xl italic"
              key={report}
            >
              “{report}”
            </p>
          ))}
        </blockquote>
      </CodexSection>
      <CodexSection label="Vínculos" title="Relações com personagens">
        <div className="grid gap-4 md:grid-cols-2">
          {relationships.length ? (
            relationships.map((relation) => {
              const characterId =
                relation.source.type === 'character'
                  ? relation.source.id
                  : relation.target.id;
              const character = characters.find(
                (item) => item.id === characterId,
              );
              return (
                <article
                  className="border border-stone-600/30 p-6"
                  key={relation.id}
                >
                  <p className="text-aged-gold-500 text-xs uppercase">
                    {relation.kind}
                  </p>
                  <h3 className="font-display mt-3 text-2xl">
                    {character?.title ?? relation.title}
                  </h3>
                </article>
              );
            })
          ) : (
            <p className="text-parchment-200/50">
              Nenhuma relação documentada.
            </p>
          )}
        </div>
      </CodexSection>
      <CodexSection label="Volumetria" title="Inspeção de modelo futura">
        <ModelInspectorContract asset={null} label={creature.title} />
      </CodexSection>
      <CodexSection label="Miniatura" title="Coleção e impressão">
        <div className="grid gap-4 md:grid-cols-2">
          <ListBlock
            title="Coleções"
            items={collections.map((item) => item.title)}
          />
          <ListBlock
            title="Perfis disponíveis"
            items={
              collections.length
                ? profiles.map(
                    (item) =>
                      `${item.scale} · ${item.fileFormat.toUpperCase()}`,
                  )
                : []
            }
          />
        </div>
      </CodexSection>
      <CodexSection label="Distribuição" title="Criaturas relacionadas">
        <div className="grid gap-4 md:grid-cols-2">
          {related.length ? (
            related.map((item) => (
              <Link
                className="border border-stone-600/30 p-6"
                href={`/bestiario/${item.slug}`}
                key={item.id}
              >
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="text-parchment-200/50 mt-2">
                  {item.classification}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-parchment-200/50">
              Nenhuma espécie compartilha este habitat.
            </p>
          )}
        </div>
      </CodexSection>
    </main>
  );
}
function CodexSection({
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
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-stone-600/30 pt-3">
      <dt className="text-aged-gold-500 text-xs uppercase">{label}</dt>
      <dd className="mt-2">{value || 'Não catalogado'}</dd>
    </div>
  );
}
function TextBlock({ title, text }: { title: string; text: string }) {
  return (
    <article>
      <h3 className="text-aged-gold-500 text-xs uppercase">{title}</h3>
      <p className="text-parchment-200/65 mt-4 leading-relaxed">{text}</p>
    </article>
  );
}
function ListBlock({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <article className="bg-coal-950 min-h-44 p-7">
      <h3 className="text-aged-gold-500 text-xs uppercase">{title}</h3>
      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-parchment-200/40 mt-4">Nenhum registro.</p>
      )}
    </article>
  );
}
