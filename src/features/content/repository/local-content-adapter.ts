import { mockContentDataset } from '@/features/content/data/content.mock';
import {
  ContentIntegrityError,
  validateContentIntegrity,
} from '@/features/content/domain/content-integrity';
import { contentDatasetSchema } from '@/features/content/domain/content-schemas';
import type { ContentDataset } from '@/features/content/domain/content-types';
import type { ContentSourceAdapter } from '@/features/content/repository/content-source-adapter';

export class LocalContentAdapter implements ContentSourceAdapter {
  readonly source = 'local' as const;

  async load(): Promise<ContentDataset> {
    const dataset = contentDatasetSchema.parse(mockContentDataset);
    const issues = validateContentIntegrity(dataset);
    if (issues.length > 0) throw new ContentIntegrityError(issues);
    return dataset;
  }
}
