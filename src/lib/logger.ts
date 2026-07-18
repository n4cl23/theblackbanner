type LogContext = Readonly<Record<string, string | number | boolean | null>>;

const BLOCKED_KEYS = /password|secret|token|authorization|cookie/i;

function sanitize(context: LogContext): LogContext {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      BLOCKED_KEYS.test(key) ? '[REDACTED]' : value,
    ]),
  );
}

export const logger = {
  info(message: string, context: LogContext = {}) {
    console.info(message, sanitize(context));
  },
  error(message: string, context: LogContext = {}) {
    console.error(message, sanitize(context));
  },
};
