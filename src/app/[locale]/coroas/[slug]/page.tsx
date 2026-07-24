import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { crowns, getCrown } from '@/content/heroic-entities';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return crowns.map(({ slug }) => ({ locale: 'pt-br', slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const crown = getCrown(slug);
  if (!crown || locale !== 'pt-br')
    return { title: 'Coroa não encontrada', robots: { index: false } };
  return {
    title: crown.title,
    description: crown.description,
    alternates: { canonical: `/pt-br/coroas/${crown.slug}` },
    openGraph: {
      title: `${crown.title} · Coroa de Asterheim`,
      description: crown.description,
    },
  };
}

export default async function CrownPage({ params }: Props) {
  const { locale, slug } = await params;
  if (locale !== 'pt-br') notFound();
  const crown = getCrown(slug);
  if (!crown) notFound();

  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: crown.title,
    description: crown.description,
    inLanguage: 'pt-BR',
  };

  return (
    <main>
      <JsonLd data={creativeWork} />
      <section className="bg-[radial-gradient(circle_at_25%_35%,rgba(126,96,45,.18),transparent_32%),linear-gradient(#090806,#030303)] grid min-h-[78vh] place-items-end px-5 py-16">
        <div className="mx-auto w-full max-w-[90rem]">
          <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
            Coroa · {crown.force} · {crown.kingdom.title}
          </p>
          <h1 className="font-display mt-5 max-w-6xl text-[clamp(4rem,12vw,10rem)] leading-[.83] uppercase">
            {crown.title}
          </h1>
          <p className="text-parchment-200/70 mt-8 max-w-3xl text-xl">
            {crown.description}
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-[90rem] gap-16 px-5 py-24 lg:grid-cols-[1.4fr_.6fr]">
        <article>
          <Field title="Origem" value={crown.history} />
          <Field title="Poder" value={crown.force} />
          <Field title="Símbolo" value={crown.symbol} />
          <Field
            title="Relíquias"
            value={crown.relics.length ? crown.relics.join(', ') : null}
          />
          <Field title="Estado atual" value={crown.currentState} />
        </article>
        <aside className="border-aged-gold-500/30 h-fit border p-7">
          <p className="text-xs tracking-widest uppercase">Relações</p>
          <Link
            className="text-aged-gold-500 mt-5 block text-xl"
            href={`/guardioes/${crown.guardianSlug}`}
          >
            Abrir Guardião vinculado
          </Link>
          <p className="mt-5">{crown.kingdom.title}</p>
          <Link className="mt-5 block underline" href="/timeline">
            {crown.documentedAt}
          </Link>
        </aside>
      </div>
    </main>
  );
}

function Field({ title, value }: { title: string; value: string | null }) {
  return (
    <section className="border-stone-700 border-t py-9">
      <h2 className="font-display text-3xl uppercase">{title}</h2>
      <p className="text-parchment-200/60 mt-4">
        {value ?? 'Não documentado na fonte canônica aprovada.'}
      </p>
    </section>
  );
}
