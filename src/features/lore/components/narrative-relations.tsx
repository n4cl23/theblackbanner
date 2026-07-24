import Link from 'next/link';
import type { NarrativeRelation } from '@/features/lore/domain/lore-schema';

const labels: Record<NarrativeRelation['kind'], string> = {
  ally: 'Aliado',
  enemy: 'Inimigo',
  mentor: 'Mentor',
  apprentice: 'Aprendiz',
  family: 'Familiar',
  rival: 'Rival',
  creator: 'Criador',
  'bound-creature': 'Criatura vinculada',
  oath: 'Juramento',
  debt: 'Dívida',
  conflict: 'Conflito',
  'shared-event': 'Evento compartilhado',
};
export function NarrativeRelations({
  relations,
}: {
  relations: readonly NarrativeRelation[];
}) {
  return (
    <section aria-labelledby="narrative-relations">
      <p className="text-aged-gold-500 text-xs uppercase">
        Rede editorial navegável
      </p>
      <h2
        className="font-display mt-4 text-5xl uppercase"
        id="narrative-relations"
      >
        Relações narrativas
      </h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {relations.map((relation) => (
          <article
            className="border-aged-gold-500/40 bg-coal-900 border-l p-7"
            key={relation.id}
          >
            <p className="text-aged-gold-500 text-xs uppercase">
              {labels[relation.kind]}
            </p>
            <h3 className="font-display mt-3 text-3xl uppercase">
              {relation.label}
            </h3>
            <p className="text-parchment-200/60 mt-4">{relation.note}</p>
            <nav
              aria-label={`Entidades de ${relation.label}`}
              className="mt-6 flex gap-4 text-sm uppercase"
            >
              <Link className="underline" href={relation.sourceHref}>
                Origem
              </Link>
              <span aria-hidden>→</span>
              <Link className="underline" href={relation.targetHref}>
                Destino
              </Link>
            </nav>
          </article>
        ))}
      </div>
    </section>
  );
}
