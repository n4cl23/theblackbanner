import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  getAllMiniatures,
  getMiniatures,
} from '@/features/collections/data/miniature-repository';

const allowedImageExtensions = new Set([
  '.webp',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
]);
const allowedVideoExtensions = new Set(['.mp4', '.webm']);

function resolvePublicPath(src: string) {
  expect(src).toMatch(/^\//);
  expect(src).not.toMatch(/^[a-z]:\\/i);
  expect(src).not.toMatch(/\.(stl|glb)$/i);
  return path.join(process.cwd(), 'public', ...src.slice(1).split('/'));
}

function assertExactCase(filePath: string) {
  const relative = path.relative(path.join(process.cwd(), 'public'), filePath);
  let current = path.join(process.cwd(), 'public');
  for (const segment of relative.split(path.sep)) {
    expect(fs.readdirSync(current)).toContain(segment);
    current = path.join(current, segment);
  }
}

describe('Sprint 22.1 media publication gate', () => {
  it('validates every associated public cover, poster and video', async () => {
    const records = await getAllMiniatures();
    for (const record of records) {
      const images = [
        ...(record.cover ? [record.cover.src] : []),
        ...record.gallery.map((asset) => asset.src),
        ...(record.video?.poster ? [record.video.poster] : []),
      ];
      for (const src of images) {
        const filePath = resolvePublicPath(src);
        expect(allowedImageExtensions.has(path.extname(filePath))).toBe(true);
        expect(fs.statSync(filePath).size).toBeGreaterThan(0);
        assertExactCase(filePath);
      }
      if (record.video) {
        const filePath = resolvePublicPath(record.video.src);
        expect(allowedVideoExtensions.has(path.extname(filePath))).toBe(true);
        expect(fs.statSync(filePath).size).toBeGreaterThan(0);
        assertExactCase(filePath);
      }
    }
  });

  it('publishes exactly the explicitly approved batch', async () => {
    const records = await getMiniatures();
    const approved = records.filter((record) => record.status === 'published');
    expect(records).toHaveLength(187);
    expect(approved).toHaveLength(14);
    expect(
      approved.every(
        (record) =>
          record.publicationBatch === 'sprint-22-1-batch-01' &&
          record.approvedAt === '2026-07-24T00:00:00.000-03:00' &&
          record.approvalSource === 'explicit-user-approval:sprint-22.1',
      ),
    ).toBe(true);
  });

  it('contains no public STL or GLB', () => {
    const files = fs.readdirSync(path.join(process.cwd(), 'public'), {
      recursive: true,
    });
    expect(
      files.filter((file) => /\.(stl|glb)$/i.test(String(file))),
    ).toHaveLength(0);
  });
});
