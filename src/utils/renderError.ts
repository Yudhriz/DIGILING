export type AuthError = string | Record<string, string[]>;

export function renderErrorMessage(error: AuthError | null): string | null {
  if (!error) return null;

  if (typeof error === "string") return error;

  return Object.values(error).flat().join(", ");
}
