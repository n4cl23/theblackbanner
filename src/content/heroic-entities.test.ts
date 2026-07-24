import { describe, expect, it } from 'vitest';
import migrationMatrix from '../../reports/v1-v2-migration-matrix.json';
import {
  approvedCharacters,
  crownSchema,
  crowns,
  getCrown,
  getGuardian,
  guardianSchema,
  guardians,
} from '@/content/heroic-entities';

describe('Sprint 21 heroic entities', () => {
  it('migrates exactly the six approved guardians and crowns', () => {
    expect(guardians).toHaveLength(6);
    expect(crowns).toHaveLength(6);
    guardians.forEach((record) => expect(guardianSchema.parse(record)).toEqual(record));
    crowns.forEach((record) => expect(crownSchema.parse(record)).toEqual(record));
  });

  it('keeps every guardian and crown relationship bidirectional', () => {
    guardians.forEach((guardian) => {
      const crown = getCrown(guardian.crownSlug);
      expect(crown?.guardianSlug).toBe(guardian.slug);
      expect(crown?.kingdom.slug).toBe(guardian.kingdom.slug);
    });
    crowns.forEach((crown) => {
      expect(getGuardian(crown.guardianSlug)?.crownSlug).toBe(crown.slug);
    });
  });

  it('uses unique slugs and complete approved provenance', () => {
    expect(new Set(guardians.map(({ slug }) => slug)).size).toBe(6);
    expect(new Set(crowns.map(({ slug }) => slug)).size).toBe(6);
    expect(
      [...guardians, ...crowns].every(
        (record) =>
          record.locale === 'pt-BR' &&
          record.sourceUrl.startsWith('https://theblackbanner.vercel.app/'),
      ),
    ).toBe(true);
  });

  it('does not promote the 42 characters pending human review', () => {
    const records = migrationMatrix.records.filter(
      (record) =>
        record.entity.startsWith('character:') &&
        record.decision === 'REVISÃO_HUMANA',
    );
    expect(records).toHaveLength(42);
    expect(approvedCharacters).toHaveLength(0);
  });

  it('preserves missing lore as unavailable instead of inventing it', () => {
    expect(
      guardians.every(
        ({ oath, sacrifice, relic, domain }) =>
          oath === null &&
          sacrifice === null &&
          relic === null &&
          domain === null,
      ),
    ).toBe(true);
    expect(
      crowns.every(
        ({ symbol, relics, currentState }) =>
          symbol === null && relics.length === 0 && currentState === null,
      ),
    ).toBe(true);
  });
});

