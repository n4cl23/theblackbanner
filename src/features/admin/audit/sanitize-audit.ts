const sensitive =
  /password|secret|token|authorization|cookie|database.?url|private.?key/i;
export function sanitizeAuditValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeAuditValue);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        sensitive.test(key) ? '[REDACTED]' : sanitizeAuditValue(entry),
      ]),
    );
  return value;
}
