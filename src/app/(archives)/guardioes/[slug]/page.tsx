import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuardian, guardians } from '@/content/heroic-entities';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guardians.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guardian = getGuardian((await params).slug);
  if (!guardian)
    return { title: 'Guardião não encontrado', robots: { index: false } };
  return {
    title: guardian.title,
    description: guardian.description,
    alternates: { canonical: `/guardioes/${guardian.slug}` },
    openGraph: {
      type: 'profile',
      title: `${guardian.title} · Guardião de Asterheim`,
      description: guardian.description,
    },
  };
}

export default async function GuardianPage({ params }: Props) {
  const guardian = getGuardian((await params).slug);
  if (!guardian) notFound();
  return (
    <main>
      <section className="bg-[radial-gradient(circle_at_70%_30%,rgba(126,96,45,.16),transparent_35%),linear-gradient(#080808,#030303)] grid min-h-[78vh] place-items-end px-5 py-16">
        <div className="mx-auto w-full max-w-[90rem]">
          <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
            Guardião · {guardian.kingdom.title}
          </p>
          <h1 className="font-display mt-5 max-w-6xl text-[clamp(4rem,12vw,10rem)] leading-[.83] uppercase">
            {guardian.title}
          </h1>
          <p className="text-parchment-200/70 mt-8 max-w-3xl text-xl">
            {guardian.description}
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-[90rem] gap-16 px-5 py-24 lg:grid-cols-[1.4fr_.6fr]">
        <article>
          <Field title="Juramento" value={guardian.oath} />
          <Field title="Sacrifício" value={guardian.sacrifice} />
          <Field title="Domínio" value={guardian.domain} />
          <Field title="Relíquia" value={guardian.relic} />
        </article>
        <aside className="border-aged-gold-500/30 h-fit border p-7">
          <p className="text-xs tracking-widest uppercase">Vínculos canônicos</p>
          <Link
            className="text-aged-gold-500 mt-5 block text-xl"
            href={`/pt-br/coroas/${guardian.crownSlug}`}
          >
            Abrir Coroa vinculada
          </Link>
          <p className="mt-5">{guardian.kingdom.title}</p>
          <Link className="mt-5 block underline" href="/timeline">
            {guardian.documentedAt}
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
