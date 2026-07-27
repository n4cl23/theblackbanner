import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { homeDomainArtwork, homeDomainOrder } from "@/content/home-domains";
import { crowns } from "@/content/heroic-entities";
import { LivingWorldMap } from "@/features/atlas/components/living-world-map";

const signatures = {
  "frost-kingdom": "The Kingdom of Ice",
  stormreach: "The Sea of Endless Storms",
  ironhold: "The Forge of a Thousand Fires",
  "elder-forest": "The Heart of the Ancients",
  "kingdom-of-the-abyss": "The Depths That Remember",
  "scorched-wastes": "The Land Where Fires Never Die",
} as const;

export const metadata: Metadata = {
  title: "Mapa Vivo de Asterheim | The Black Banner",
  description:
    "Explore os seis domínios registrados no Atlas de Asterheim.",
};

export default async function AtlasMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "pt-br") notFound();

  const crownByKingdom = new Map(
    crowns.map((crown) => [crown.kingdom.slug, crown]),
  );
  const kingdoms = homeDomainOrder.map((slug) => {
    const crown = crownByKingdom.get(slug);

    return {
      slug,
      name: crown?.kingdom.title ?? slug,
      signature: signatures[slug],
      image: homeDomainArtwork[slug].image,
      force: crown?.force ?? "—",
    };
  });

  return (
    <main className="living-atlas-page">
      <LivingWorldMap kingdoms={kingdoms} locale={locale} />
    </main>
  );
}
