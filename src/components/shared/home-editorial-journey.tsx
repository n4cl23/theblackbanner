import Image from 'next/image';
import Link from 'next/link';

type KingdomJourneyItem = {
  artwork: string;
  atmosphere: string;
  description: string;
  mobilePosition: string;
  position: string;
  signature: string;
  slug: string;
  title: string;
};

export function KingdomEditorialJourney({
  kingdoms,
}: {
  kingdoms: readonly KingdomJourneyItem[];
}) {
  return (
    <div className="kingdom-chapters">
      {kingdoms.map((kingdom, index) => (
        <article
          className={`kingdom-chapter kingdom-chapter--${kingdom.atmosphere}`}
          key={kingdom.slug}
        >
          <Image
            alt={`Key art oficial de ${kingdom.title}: ${kingdom.signature}`}
            className={`kingdom-chapter__image ${kingdom.position} ${kingdom.mobilePosition}`}
            fill
            priority={index === 0}
            sizes="100vw"
            src={kingdom.artwork}
          />
          <div aria-hidden="true" className="kingdom-chapter__atmosphere" />
          <div aria-hidden="true" className="kingdom-chapter__shade" />

          <div className="kingdom-chapter__content">
            <p className="kingdom-chapter__count">
              {String(index + 1).padStart(2, '0')} / 06
            </p>
            <h3 className="sr-only">{kingdom.title}</h3>
            <p className="sr-only">{kingdom.signature}</p>
            <p className="kingdom-chapter__description">
              {kingdom.description}
            </p>
            <Link
              className="kingdom-chapter__cta"
              href={`/pt-br/atlas/reinos/${kingdom.slug}`}
            >
              Explorar Reino <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div aria-hidden="true" className="kingdom-chapter__progress">
            {kingdoms.map((item, progressIndex) => (
              <span
                className={
                  progressIndex === index
                    ? 'kingdom-chapter__progress-mark kingdom-chapter__progress-mark--active'
                    : 'kingdom-chapter__progress-mark'
                }
                key={item.slug}
              />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
