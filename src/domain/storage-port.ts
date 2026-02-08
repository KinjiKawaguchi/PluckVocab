import type { Result } from "./result.js";
import type { Vocab } from "./vocab.js";

export type StorageError = "read-failed" | "write-failed";

export type StoragePort = Readonly<{
  load: () => Promise<Result<Vocab, StorageError>>;
  save: (vocab: Vocab) => Promise<Result<void, StorageError>>;
}>;
