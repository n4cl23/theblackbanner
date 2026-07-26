import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/config/i18n';
import { localizedPath } from '@/features/i18n/data/route-registry';

type KingdomPoster = {
  artwork: string;
  fit: 'contain' | 'cover';
  objectPosition: string;
  slug: string;
  title: string;
};

export function KingdomEditorialJourney({
  kingdoms,
  locale,
}: {
  kingdoms: readonly KingdomPoster[];
  locale: Locale;
}) {
  return (
    <div className="kingdom-poster-grid">
      {kingdoms.map((kingdom) => (
        <Link
          aria-label={`Explorar ${kingdom.title}`}
          className="kingdom-poster"
          href={localizedPath(locale, `atlas/reinos/${kingdom.slug}`)}
          key={kingdom.slug}
        >
          <div className="kingdom-poster__art">
            <Image
              alt={`Key art oficial de ${kingdom.title}`}
              className={`kingdom-poster__image ${
                kingdom.fit === 'contain'
                  ? 'kingdom-poster__image--contain'
                  : 'kingdom-poster__image--cover'
              }`}
              fill
              sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) 50vw, 33vw"
              src={kingdom.artwork}
              style={{ objectPosition: kingdom.objectPosition }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
