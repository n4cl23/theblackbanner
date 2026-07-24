import { describe, expect, it } from 'vitest';
import { EditorialStatus } from '@/generated/prisma/client';
import { mockContentDataset } from '@/features/content/data/content.mock';
import { auditEditorialDataset } from './domain/editorial-audit';
import {
  validateCmsPublication,
  validateDatasetPublication,
} from './domain/publication-policy';

describe('editorial completeness', () => {
  it('audits every modeled entity and preserves referential integrity', () => {
    const report = auditEditorialDataset(mockContentDataset);
    expect(report.totalEntities).toBe(43);
    expect(report.duplicateSlugs).toBe(0);
    expect(report.brokenReferences).toBe(0);
    expect(report.unassignedCharacters).toBe(0);
    expect(report.creaturesWithoutRegions).toBe(0);
    expect(report.eventsWithoutParticipants).toBe(0);
  });

  it('does not misrepresent provisional drafts as published content', () => {
    const report = auditEditorialDataset(mockContentDataset);
    expect(report.byStatus).toEqual({
      draft: 43,
      review: 0,
      published: 0,
      archived: 0,
    });
    expect(validateDatasetPublication(mockContentDataset)).toEqual([]);
  });

  it('blocks an incomplete CMS record from publication', () => {
    const issues = validateCmsPublication({
      title: 'Registro',
      slug: 'registro',
      excerpt: null,
      body: {},
    });
    expect(issues.map((issue) => issue.path)).toEqual(['excerpt', 'body']);
    expect(EditorialStatus.PUBLISHED).toBe('PUBLISHED');
  });
});
