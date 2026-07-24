import { LocalContentAdapter } from '@/features/content/repository/local-content-adapter';
import { createContentRepository } from '@/features/content/repository/in-memory-content-repository';

export function getContentRepository() {
  return createContentRepository(new LocalContentAdapter());
}
