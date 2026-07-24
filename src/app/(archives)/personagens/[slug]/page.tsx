import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContentRepository } from '@/features/content/repository/repository';
import { EditorialMedia } from '@/features/characters/components/editorial-media';
import { getCharacterPageData } from '@/features/characters/data/character-repository';
import { getMiniaturesByEntity } from '@/features/collections/data/miniature-repository';

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await (await getContentRepository()).getCharacters()).map(
    ({ slug }) => ({ slug }),
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCharacterPageData(slug);
  if (!data)
    return { title: 'Personagem não encontrado', robots: { index: false } };
  return {
    title: data.character.seo.title,
    description: data.character.seo.description,
    alternates: { canonical: `/personagens/${slug}` },
    openGraph: {
      title: data.character.title,
      description: data.character.excerpt,
      type: 'profile',
      images: data.presentation ? [{ url: data.presentation.image }] : [],
    },
  };
}

export default async function CharacterPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCharacterPageData(slug);
  const miniatures = await getMiniaturesByEntity(slug);
  if (!data || !data.presentation) notFound();
  const {
    character,
    presentation,
    kingdom,
    factions,
    weapons,
    events,
    relationships,
    collections,
    related,
  } = data;
  const p = presentation.personality;
  return (
    <main>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          alt={`Ambiente provisório associado a ${character.title}`}
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src={presentation.image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,.98)_5%,rgba(3,3,3,.35)_62%,rgba(3,3,3,.85))]" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-[90rem] flex-col justify-end px-5 py-14 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="text-parchment-200/55 text-xs uppercase"
          >
            <Link href="/personagens">Personagens</Link> / {character.title}
          </nav>
          <div className="max-w-4xl pt-32">
            <p className="text-aged-gold-500 text-xs tracking-[.32em] uppercase">
              {presentation.treatment} · {character.role}
            </p>
            <h1 className="font-display mt-5 text-[clamp(4rem,11vw,9rem)] leading-[.82] uppercase">
              {character.title}
            </h1>
            <p className="font-subtitle text-parchment-200/75 mt-7 text-2xl italic">
              {presentation.epithet}
            </p>
          </div>
        </div>
      </section>
      <CharacterSection label="Identidade" title="O registro">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-parchment-200/70 text-xl leading-relaxed">
              {character.description}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-5">
              <Fact label="Reino" value={kingdom?.title ?? 'Não catalogado'} />
              <Fact
                label="Facção"
                value={
                  factions.map((item) => item.title).join(', ') ||
                  'Sem registro'
                }
              />
              <Fact label="Função" value={character.role} />
              <Fact label="Epíteto" value={presentation.epithet} />
            </dl>
          </div>
          <div>
            {presentation.biography.map((paragraph) => (
              <p
                className="text-parchment-200/60 mb-5 leading-relaxed"
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
            <h3 className="text-aged-gold-500 mt-8 text-xs tracking-widest uppercase">
              Motivações
            </h3>
            <ul className="mt-4 space-y-3">
              {presentation.motivations.map((item) => (
                <li className="border-l border-stone-600/30 pl-4" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CharacterSection>
      <CharacterSection label="Psique" title="Personalidade">
        <div className="grid gap-px bg-stone-600/25 md:grid-cols-2 xl:grid-cols-4">
          <Trait title="Virtudes" values={p.virtues} />
          <Trait title="Falhas" values={p.flaws} />
          <Trait title="Medos" values={p.fears} />
          <Trait title="Desejos" values={p.desires} />
          <Trait title="Comportamento" values={[p.behavior]} wide />
          <Trait title="Visão de mundo" values={[p.worldview]} />
          <Trait
            title="Conflitos internos"
            values={[p.internalConflicts]}
            wide
          />
        </div>
      </CharacterSection>
      <CharacterSection label="Vínculos" title="Alianças e rivalidades">
        <div className="grid gap-4 md:grid-cols-2">
          {relationships.length ? (
            relationships.map((relation) => (
              <article
                className="border border-stone-600/30 p-6"
                key={relation.id}
              >
                <p className="text-aged-gold-500 text-xs uppercase">
                  {relation.kind}
                </p>
                <h3 className="font-display mt-3 text-2xl">{relation.title}</h3>
                <p className="text-parchment-200/55 mt-3">{relation.excerpt}</p>
              </article>
            ))
          ) : (
            <p className="text-parchment-200/50">Nenhuma relação catalogada.</p>
          )}
        </div>
      </CharacterSection>
      <CharacterSection label="Arsenal" title="Equipamentos">
        <EntityStrip
          items={weapons.map((item) => ({
            title: item.title,
            detail: item.weaponType,
          }))}
          empty="Nenhum equipamento catalogado."
        />
      </CharacterSection>
      <CharacterSection label="Cronologia" title="Eventos da timeline">
        <ol className="border-l border-stone-600/30">
          {events.map((event) => (
            <li
              className="before:bg-aged-gold-500 relative ml-7 pb-8 before:absolute before:top-2 before:-left-[2rem] before:size-2 before:rotate-45"
              key={event.id}
            >
              <span className="text-aged-gold-500 text-xs uppercase">
                {event.dateLabel}
              </span>
              <h3 className="font-display mt-2 text-2xl">{event.title}</h3>
            </li>
          ))}
        </ol>
      </CharacterSection>
      <CharacterSection label="Mídia" title="Galeria e movimento">
        <EditorialMedia
          alt={`Registro visual de ${character.title}`}
          caption={presentation.mediaCaption}
          credit={presentation.mediaCredit}
          image={presentation.image}
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FutureMedia title="Vídeo / GIF / WebM" />
          <FutureMedia title="Modelo 3D futuro" />
        </div>
      </CharacterSection>
      <CharacterSection label="Miniatura" title="Coleção e impressão">
        <div className="grid gap-5 md:grid-cols-2">
          <EntityStrip
            items={collections.map((item) => ({
              title: item.title,
              detail: 'Coleção provisória',
            }))}
            empty="Fora das coleções atuais."
          />
          <EntityStrip
            items={miniatures.map((item) => ({
              title: item.title,
              detail: `${item.scale} · ${item.printDifficulty}`,
              href: `/pt-br/miniaturas/${item.slug}`,
            }))}
            empty="Miniatura não associada."
          />
        </div>
      </CharacterSection>
      <CharacterSection label="Ecos" title="Personagens relacionados">
        <EntityStrip
          items={related.map((item) => ({
            title: item.title,
            detail: item.role,
            href: `/personagens/${item.slug}`,
          }))}
          empty="Nenhum personagem relacionado."
        />
      </CharacterSection>
    </main>
  );
}

function CharacterSection({
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
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.48fr_1.52fr]">
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
      <dd className="mt-2">{value}</dd>
    </div>
  );
}
function Trait({
  title,
  values,
  wide = false,
}: {
  title: string;
  values: readonly string[];
  wide?: boolean;
}) {
  return (
    <article
      className={`bg-coal-950 min-h-44 p-6 ${wide ? 'xl:col-span-2' : ''}`}
    >
      <h3 className="text-aged-gold-500 text-xs tracking-widest uppercase">
        {title}
      </h3>
      <ul className="text-parchment-200/65 mt-4 space-y-2">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </article>
  );
}
function EntityStrip({
  items,
  empty,
}: {
  items: readonly { title: string; detail: string; href?: string }[];
  empty: string;
}) {
  return items.length ? (
    <div className="grid gap-px bg-stone-600/25 sm:grid-cols-2">
      {items.map((item) => {
        const content = (
          <>
            <h3 className="font-display text-2xl">{item.title}</h3>
            <p className="text-parchment-200/50 mt-2 text-sm">{item.detail}</p>
          </>
        );
        return item.href ? (
          <Link className="bg-coal-950 p-6" href={item.href} key={item.title}>
            {content}
          </Link>
        ) : (
          <article className="bg-coal-950 p-6" key={item.title}>
            {content}
          </article>
        );
      })}
    </div>
  ) : (
    <p className="text-parchment-200/50 border border-stone-600/30 p-6">
      {empty}
    </p>
  );
}
function FutureMedia({ title }: { title: string }) {
  return (
    <div className="grid min-h-32 place-items-center border border-dashed border-stone-600/30 text-center">
      <div>
        <p className="font-display text-xl">{title}</p>
        <span className="text-parchment-200/35 text-xs uppercase">
          Slot preparado · sem mídia oficial
        </span>
      </div>
    </div>
  );
}
