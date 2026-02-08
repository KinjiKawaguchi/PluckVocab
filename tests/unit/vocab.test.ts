import { describe, expect, test } from "bun:test";
import { createWord, isOk } from "../../src/domain/index.js";

describe("createWord", () => {
  test("normalizes to lowercase", () => {
    const result = createWord("Hello");
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value as string).toBe("hello");
    }
  });

  test("trims whitespace", () => {
    const result = createWord("  world  ");
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value as string).toBe("world");
    }
  });

  test("returns error for empty string", () => {
    const result = createWord("");
    expect(isOk(result)).toBe(false);
  });

  test("returns error for whitespace-only string", () => {
    const result = createWord("   ");
    expect(isOk(result)).toBe(false);
  });

  test("handles mixed case", () => {
    const result = createWord("JavaScript");
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value as string).toBe("javascript");
    }
  });
});
