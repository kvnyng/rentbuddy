/**
 * Expected failures are values. A function that can fail in a way the caller
 * must handle returns Result with a union of error kinds instead of throwing.
 */
export type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/**
 * For the rare switch TypeScript can't prove exhaustive on its own.
 * Lint already fails on missing cases in ordinary union switches.
 */
export function assertNever(value: never, context = "value"): never {
  throw new Error(`Unhandled ${context}: ${JSON.stringify(value)}`);
}
