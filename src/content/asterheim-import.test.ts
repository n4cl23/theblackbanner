import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { asterheimEditorialImport } from '@/content/asterheim-editorial-import';
import { asterheimMediaManifest } from '@/content/asterheim-media-manifest';

describe('Asterheim import contracts', () => {
  it('keeps media identifiers unique and files physically available', () => {
    const ids = asterheimMediaManifest.map((media) => media.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const media of asterheimMediaManifest) {
      expect(existsSync(resolve('public', media.src.slice(1)))).toBe(true);
    }
  });

  it('keeps imported editorial documents in review', () => {
    expect(asterheimEditorialImport).toHaveLength(30);
    expect(
      asterheimEditorialImport.every((record) => record.status === 'review'),
    ).toBe(true);
    expect(
      new Set(asterheimEditorialImport.map((record) => record.contentHash))
        .size,
    ).toBe(30);
  });

  it('never exposes private print or model formats through the media manifest', () => {
    expect(
      asterheimMediaManifest.some((media) =>
        /\.(?:stl|3mf|glb|cxdlpv4)$/i.test(media.src),
      ),
    ).toBe(false);
  });
});
