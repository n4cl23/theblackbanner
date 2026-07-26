import Image from 'next/image';
import Link from 'next/link';

type KingdomPoster = {
  artwork: string;
  slug: string;
  title: string;
};

export function KingdomEditorialJourney({
  kingdoms,
}: {
  kingdoms: readonly KingdomPoster[];
}) {
  return (
    <div className="kingdom-poster-grid">
      {kingdoms.map((kingdom) => (
        <Link
          aria-label={`Explorar ${kingdom.title}`}
          className="kingdom-poster"
          href={`/pt-br/atlas/reinos/${kingdom.slug}`}
          key={kingdom.slug}
        >
          <div className="kingdom-poster__art">
            <Image
              alt={`Key art oficial de ${kingdom.title}`}
              className="kingdom-poster__image"
              fill
              sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) 50vw, 33vw"
              src={kingdom.artwork}
            />
          </div>
          <span className="kingdom-poster__cta">
            Explorar Reino <span aria-hidden="true">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
