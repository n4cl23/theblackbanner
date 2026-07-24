import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const audit = JSON.parse(
  readFileSync('reports/v1-v2-migration-matrix.json', 'utf8'),
) as {
  summary: {
    v1: {
      sitemapRoutes: number;
      semanticEntities: number;
      statusFailures: number;
      brokenInternalLinks: unknown[];
    };
    v2: {
      sitemapRoutes: number;
      semanticEntities: number;
      statusFailures: number;
      mocks: number;
      brokenMediaReferences: number;
      brokenInternalLinks: unknown[];
    };
  };
  records: Array<Record<string, unknown> & { decision: string }>;
};

const decisions = new Set([
  'MIGRAR',
  'MIGRAR_COM_CORREÇÃO',
  'CONSOLIDAR',
  'MANTER_V2',
  'DESCARTAR_MOCK',
  'ARQUIVAR',
  'REVISÃO_HUMANA',
]);

describe('V1 → V2 migration audit', () => {
  it('covers every route declared by both production sitemaps', () => {
    expect(audit.summary.v1).toMatchObject({
      sitemapRoutes: 507,
      semanticEntities: 169,
      statusFailures: 0,
      brokenInternalLinks: [],
    });
    expect(audit.summary.v2).toMatchObject({
      sitemapRoutes: 40,
      semanticEntities: 29,
      statusFailures: 0,
      brokenInternalLinks: [],
    });
  });

  it('uses only allowed decisions and complete migration records', () => {
    expect(audit.records).toHaveLength(212);
    for (const record of audit.records) {
      expect(decisions.has(record.decision)).toBe(true);
      expect(record).toEqual(
        expect.objectContaining({
          entity: expect.any(String),
          origin: expect.any(String),
          destination: expect.any(String),
          decision: expect.any(String),
          media: expect.any(String),
          relations: expect.any(String),
          locale: expect.anything(),
          priority: expect.any(String),
          risk: expect.any(String),
        }),
      );
    }
  });

  it('keeps V2 mocks and media risks explicit', () => {
    expect(audit.summary.v2.mocks).toBe(43);
    expect(audit.summary.v2.brokenMediaReferences).toBe(0);
    expect(
      audit.records.filter((record) => record.decision === 'DESCARTAR_MOCK'),
    ).toHaveLength(43);
  });

  it('documents the functional gap and ordered migration plan', () => {
    const report = readFileSync('reports/v1-v2-functional-gap.md', 'utf8');
    expect(report).toContain('Art Bible');
    expect(report).toContain('Impressão 3D');
    expect(report).toContain('Marketplaces');
    expect(report).toContain('Ordem de migração recomendada');
    expect(report).toContain('Preview');
  });
});
