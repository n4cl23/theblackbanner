import type { ContentDataset } from '@/features/content/domain/content-types';

export interface ContentSourceAdapter {
  readonly source: 'local' | 'database' | 'cms';
  load(): Promise<ContentDataset>;
}

export type ContentDatasetLoader = () => Promise<unknown>;
