export type Result<T, E> =
  | { readonly _tag: "ok"; readonly value: T }
  | { readonly _tag: "err"; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({ _tag: "ok", value });

export const err = <E>(error: E): Result<never, E> => ({ _tag: "err", error });

export const isOk = <T, E>(
  result: Result<T, E>,
): result is { readonly _tag: "ok"; readonly value: T } => result._tag === "ok";

export const isErr = <T, E>(
  result: Result<T, E>,
): result is { readonly _tag: "err"; readonly error: E } => result._tag === "err";

export const match = <T, E, R>(
  result: Result<T, E>,
  onOk: (value: T) => R,
  onErr: (error: E) => R,
): R => (result._tag === "ok" ? onOk(result.value) : onErr(result.error));

export const map = <T, E, U>(result: Result<T, E>, f: (value: T) => U): Result<U, E> =>
  result._tag === "ok" ? ok(f(result.value)) : result;

export const flatMap = <T, E, U>(
  result: Result<T, E>,
  f: (value: T) => Result<U, E>,
): Result<U, E> => (result._tag === "ok" ? f(result.value) : result);

export const mapAsync = async <T, E, U>(
  result: Result<T, E>,
  f: (value: T) => Promise<U>,
): Promise<Result<U, E>> => (result._tag === "ok" ? ok(await f(result.value)) : result);

export const flatMapAsync = async <T, E, U>(
  result: Result<T, E>,
  f: (value: T) => Promise<Result<U, E>>,
): Promise<Result<U, E>> => (result._tag === "ok" ? f(result.value) : result);
