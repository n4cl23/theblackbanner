import canonicalSource from './asterheim-canonical.generated.json';
import { canonicalContentCollectionSchema } from './canonical-content-schema';

export const canonicalContent =
  canonicalContentCollectionSchema.parse(canonicalSource);

export function getCanonicalContentByType(
  entityType: (typeof canonicalContent)[number]['entityType'],
) {
  return canonicalContent.filter((record) => record.entityType === entityType);
}

export function getCanonicalContentBySlug(slug: string) {
  return canonicalContent.find((record) => record.slug === slug) ?? null;
}
