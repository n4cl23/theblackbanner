export interface MediaDescriptor {
  storageKey: string;
  mimeType: string;
  byteSize: bigint;
  checksum?: string;
}
export interface MediaStorage {
  reserve(input: {
    filename: string;
    mimeType: string;
    byteSize: bigint;
  }): Promise<MediaDescriptor>;
  remove(storageKey: string): Promise<void>;
}
export class UnconfiguredMediaStorage implements MediaStorage {
  reserve(input: {
    filename: string;
    mimeType: string;
    byteSize: bigint;
  }): Promise<MediaDescriptor> {
    void input;
    return Promise.reject(
      new Error(
        'Media storage is not configured. Files are never stored in PostgreSQL.',
      ),
    );
  }
  remove(): Promise<void> {
    return Promise.reject(new Error('Media storage is not configured.'));
  }
}
