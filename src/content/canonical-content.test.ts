import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  canonicalContent,
  getCanonicalContentByType,
} from '@/content/canonical-content';
import { canonicalContentCollectionSchema } from '@/content/canonical-content-schema';
import { removedDemoSlugs } from '@/content/removed-demo-content';
import {
  featuredCharacters,
  featuredCollections,
  featuredCreatures,
  featuredKingdoms,
} from '@/content/home.canonical';

const mojibake = /Ã(?:£|µ|§|¡|©|­|³|º|ª)|Â(?:·|»|«)|â(?:€|†|œ)|�/;

describe('canonical content migration', () => {
  it('validates every approved record with Zod', () => {
    expect(() => canonicalContentCollectionSchema.parse(canonicalContent)).not.toThrow();
    expect(canonicalContent).toHaveLength(65);
  });

  it('keeps incomplete records out of published state', () => {
    expect(canonicalContent.every((record) => ['draft', 'review'].includes(record.status))).toBe(true);
    expect(canonicalContent.filter((record) => record.status === 'draft')).toHaveLength(15);
  });

  it('uses valid locales, references and serialized values', () => {
    const ids = new Set(canonicalContent.map((record) => record.id));
    expect(canonicalContent.every((record) => record.locale === 'pt-BR')).toBe(true);
    expect(canonicalContent.flatMap((record) => record.relationshipIds).every((id) => ids.has(id))).toBe(true);
    expect(JSON.stringify(canonicalContent)).not.toContain('undefined');
  });

  it('prevents encoding regressions', () => {
    const source = readFileSync(
      'src/content/asterheim-canonical.generated.json',
      'utf8',
    );
    expect(source).not.toMatch(mojibake);
  });

  it('does not expose named demo records in canonical home groups', () => {
    const names = [
      ...featuredKingdoms,
      ...featuredCharacters,
      ...featuredCreatures,
      ...featuredCollections,
    ].map((record) => record.name);
    expect(names).not.toEqual(
      expect.arrayContaining([
        'The Ashen Reach',
        'The Iron March',
        'The Veiled Crown',
        'The Far Watcher',
        'The Banner Bearer',
        'The Bone Below',
        'The Fog Stalker',
        'Vanguard Studies',
        'Relics of the Road',
      ]),
    );
    expect(removedDemoSlugs.size).toBe(11);
  });

  it('contains the approved canonical collections', () => {
    expect(getCanonicalContentByType('collection')).toHaveLength(6);
  });
});
