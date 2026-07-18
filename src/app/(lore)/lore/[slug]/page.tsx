import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContentRepository } from '@/features/content/repository/repository';
import { getLoreArticleData } from '@/features/lore/data/lore-repository';
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await (await getContentRepository()).getLoreArticles()).map(
    ({ slug }) => ({ slug }),
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLoreArticleData(slug);
  if (!data) return { title: 'Lore não encontrado', robots: { index: false } };
  return {
    title: data.article.title,
    description: data.article.excerpt,
    alternates: { canonical: `/lore/${slug}` },
  };
}
export default async function LoreArticlePage({ params }: Props) {
  const { slug } = await params;
  const data = await getLoreArticleData(slug);
  if (!data) notFound();
  const { article, mentioned, related } = data;
  return (
    <main className="mx-auto max-w-[80rem] px-5 py-16">
      <header className="mx-auto max-w-[52rem] py-16 text-center">
        <p className="text-aged-gold-500 text-xs uppercase">
          Artigo provisório · {article.locale}
        </p>
        <h1 className="font-display mt-5 text-[clamp(3.5rem,8vw,7rem)] leading-[.9] uppercase">
          {article.title}
        </h1>
        <p className="text-parchment-200/60 mt-7 text-xl">{article.subtitle}</p>
      </header>
      <div className="grid gap-12 lg:grid-cols-[15rem_1fr]">
        <aside>
          <nav aria-label="Sumário">
            <h2 className="font-display text-2xl uppercase">Sumário</h2>
            <ol className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#opening">I. Registro</a>
              </li>
              <li>
                <a href="#notes">II. Notas</a>
              </li>
              <li>
                <a href="#references">III. Referências</a>
              </li>
            </ol>
          </nav>
        </aside>
        <article className="max-w-[45rem]">
          <section id="opening">
            <h2 className="font-display text-4xl uppercase">Registro</h2>
            {article.body.map((p) => (
              <p className="mt-6 text-lg leading-8" key={p}>
                {p}
              </p>
            ))}
            <blockquote className="border-aged-gold-500 my-10 border-l pl-6 text-2xl italic">
              “O arquivo recorda até aquilo que o mundo decidiu esquecer.”{' '}
              <cite className="mt-3 block text-sm not-italic">
                Citação mockada
              </cite>
            </blockquote>
          </section>
          <section className="mt-16" id="notes">
            <h2 className="font-display text-4xl uppercase">
              Notas e capítulos
            </h2>
            <p className="text-parchment-200/65 mt-5">
              Estrutura editorial provisória. Nenhum trecho estabelece cânone
              oficial.
            </p>
          </section>
          <section className="mt-16" id="references">
            <h2 className="font-display text-4xl uppercase">
              Entidades mencionadas
            </h2>
            <ul className="mt-5 space-y-3">
              {mentioned.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          </section>
          <section className="mt-16">
            <h2 className="font-display text-4xl uppercase">Galeria</h2>
            <p className="text-parchment-200/50 mt-5">
              Nenhum registro visual aprovado para este artigo.
            </p>
          </section>
          {related[0] ? (
            <Link
              className="mt-16 block border-t border-stone-600/30 pt-8 text-xl underline"
              href={`/lore/${related[0].slug}`}
            >
              Artigo relacionado: {related[0].title}
            </Link>
          ) : null}
        </article>
      </div>
    </main>
  );
}
