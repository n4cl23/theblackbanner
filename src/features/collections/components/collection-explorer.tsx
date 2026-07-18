'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
export interface CollectionRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  banner: string;
  identity: string;
  itemCount: number;
}
export function CollectionExplorer({
  records,
  categories,
}: {
  records: readonly CollectionRecord[];
  categories: readonly string[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selected = params.get('categoria') ?? '';
  const visible = selected
    ? records.filter((item) => item.category === selected)
    : records;
  function update(value: string) {
    const next = new URLSearchParams();
    if (value) next.set('categoria', value);
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, {
      scroll: false,
    });
  }
  return (
    <div>
      <label>
        <span className="sr-only">Filtrar coleções por categoria</span>
        <select
          aria-label="Categoria da coleção"
          className="bg-coal-950 min-h-12 border border-stone-600/40 px-4"
          onChange={(event) => update(event.target.value)}
          value={selected}
        >
          <option value="">Todas as coleções</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <p className="text-parchment-200/45 my-7 text-xs uppercase" role="status">
        {visible.length} coleções encontradas
      </p>
      {visible.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {visible.map((item, index) => (
            <Link
              className={`group relative overflow-hidden border border-stone-600/30 ${index === 0 ? 'min-h-[36rem]' : 'min-h-[30rem]'}`}
              href={`/colecoes/${item.slug}`}
              key={item.id}
            >
              <Image
                alt={`Banner provisório de ${item.title}`}
                className="object-cover opacity-50 transition duration-700 group-hover:scale-105 group-hover:opacity-70"
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                src={item.banner}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
                  {item.category} · {item.itemCount} modelos
                </p>
                <h2 className="font-display mt-4 text-4xl uppercase sm:text-5xl">
                  {item.title}
                </h2>
                <p className="text-parchment-200/60 mt-4 max-w-xl">
                  {item.identity}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-stone-600/30 py-20 text-center">
          <h2 className="font-display text-3xl">
            Coleção ainda não documentada
          </h2>
          <p className="text-parchment-200/45 mt-3">
            A categoria é suportada pelo modelo, mas não possui conteúdo
            provisório.
          </p>
        </div>
      )}
    </div>
  );
}
