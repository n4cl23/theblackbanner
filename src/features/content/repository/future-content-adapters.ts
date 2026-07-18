import { contentDatasetSchema } from '@/features/content/domain/content-schemas';
import type { ContentDataset } from '@/features/content/domain/content-types';
import type {
  ContentDatasetLoader,
  ContentSourceAdapter,
} from '@/features/content/repository/content-source-adapter';

abstract class ExternalContentAdapter implements ContentSourceAdapter {
  abstract readonly source: 'database' | 'cms';

  constructor(private readonly loader: ContentDatasetLoader) {}

  async load(): Promise<ContentDataset> {
    return contentDatasetSchema.parse(await this.loader());
  }
}

export class DatabaseContentAdapter extends ExternalContentAdapter {
  readonly source = 'database' as const;
}

export class CmsContentAdapter extends ExternalContentAdapter {
  readonly source = 'cms' as const;
}
