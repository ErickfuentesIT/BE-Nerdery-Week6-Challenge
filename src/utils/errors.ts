export function formatError(action: string, error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  return `${action}: ${message}`;
}
