export class StorageError extends Error {
  data?: unknown;

  constructor(message: Error['message'], data?: unknown) {
    super(message);

    this.data = data;
    this.message = message;
    this.name = 'StorageError';
  }
}
