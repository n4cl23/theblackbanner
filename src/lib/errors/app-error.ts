export class AppError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly statusCode = 500,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'AppError';
  }
}
