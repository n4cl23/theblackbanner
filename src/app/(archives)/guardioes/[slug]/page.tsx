import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContentRepository } from '@/features/content/repository/repository';
import { getGuardianPageData } from '@/features/characters/data/character-repository';
import { guardianPresentation } from '@/features/characters/data/character-presentation.mock';

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await (await getContentRepository()).getGuardians()).map(
    ({ slug }) => ({ slug }),
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getGuardianPageData(slug);
  if (!data)
    return { title: 'Guardião não encontrado', robots: { index: false } };
  return {
    title: data.guardian.seo.title,
    description: data.guardian.seo.description,
    alternates: { canonical: `/guardioes/${slug}` },
    openGraph: {
      title: data.guardian.title,
      description: data.guardian.excerpt,
      images: [{ url: guardianPresentation.image }],
    },
  };
}
export default async function GuardianPage({ params }: Props) {
  const { slug } = await params;
  const data = await getGuardianPageData(slug);
  if (!data) notFound();
  const { guardian, linkedCharacter, events } = data;
  return (
    <main className="guardian-monument">
      <section className="relative grid min-h-[92vh] place-items-center overflow-hidden px-5 text-center">
        <Image
          alt={`Domínio provisório de ${guardian.title}`}
          className="object-cover opacity-40"
          fill
          priority
          sizes="100vw"
          src={guardianPresentation.image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#05050566,#050505_92%),radial-gradient(circle,transparent,#050505_70%)]" />
        <div className="relative max-w-5xl">
          <nav
            aria-label="Breadcrumb"
            className="text-parchment-200/45 text-xs uppercase"
          >
            <Link href="/guardioes">Guardiões</Link> / {guardian.title}
          </nav>
          <span className="text-aged-gold-500 mt-16 block text-7xl">
            {guardianPresentation.symbol}
          </span>
          <h1 className="font-display mt-8 text-[clamp(4rem,11vw,9rem)] leading-[.84] uppercase">
            {guardian.title}
          </h1>
          <p className="font-subtitle text-parchment-200/75 mx-auto mt-9 max-w-3xl text-2xl italic">
            “{guardianPresentation.oath}”
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[80rem] px-5 py-24 sm:px-8">
        <div className="grid gap-px bg-stone-600/25 md:grid-cols-2">
          <Monument label="Domínio" value={guardianPresentation.domain} />
          <Monument label="Relíquia" value={guardianPresentation.relic} />
          <Monument
            label="Função no mundo"
            value={guardianPresentation.worldFunction}
          />
          <Monument
            label="Vínculo com as Coroas"
            value={guardianPresentation.crownBond}
          />
          <Monument
            label="Forma vinculada"
            value={linkedCharacter?.title ?? 'Não revelada'}
          />
          <Monument label="Símbolo" value={guardianPresentation.symbol} />
        </div>
      </section>
      <section className="border-y border-stone-600/25">
        <div className="mx-auto grid max-w-[80rem] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[.6fr_1.4fr]">
          <header>
            <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
              Memória monumental
            </p>
            <h2 className="font-display mt-4 text-4xl uppercase">
              Eventos históricos
            </h2>
          </header>
          {events.length ? (
            <ol>
              {events.map((event) => (
                <li
                  className="border-b border-stone-600/30 py-6"
                  key={event.id}
                >
                  <span className="text-aged-gold-500 text-xs uppercase">
                    {event.dateLabel}
                  </span>
                  <h3 className="font-display mt-2 text-3xl">{event.title}</h3>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-parchment-200/50">
              Nenhum evento foi confirmado neste arquivo provisório.
            </p>
          )}
        </div>
      </section>
      <section className="mx-auto max-w-[80rem] px-5 py-20 sm:px-8">
        <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
          Miniaturas
        </p>
        <h2 className="font-display mt-4 text-4xl uppercase">
          Arquivo de formas monumentais
        </h2>
        <p className="text-parchment-200/60 mt-5 max-w-2xl">
          Nenhuma miniatura deste Guardião foi publicada neste arquivo
          provisório.
        </p>
        <Link
          className="mt-7 inline-flex min-h-12 items-center border border-stone-600/40 px-5 uppercase"
          href="/pt-br/miniaturas?tipo=guardian"
        >
          Consultar arquivo de miniaturas
        </Link>
      </section>
    </main>
  );
}
function Monument({ label, value }: { label: string; value: string }) {
  return (
    <article className="bg-coal-950 min-h-48 p-8">
      <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
        {label}
      </p>
      <p className="font-display mt-5 text-2xl leading-relaxed">{value}</p>
    </article>
  );
}
