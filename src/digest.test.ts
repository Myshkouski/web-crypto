import { describe, expect, test } from "vitest";

import { sha1, sha256, sha384, sha512 } from "./digest.js";

describe("digest", () => {
  const input = "This is sample text to test digest";

  test("sha1", async () => {
    expect(await sha1(input)).toBe("3335e0a1ba08ffc5c4436eadaf5f760890ee1c06");
  });

  test("sha256", async () => {
    expect(await sha256(input)).toBe(
      "4205e993052efd7c85188a8a52f2a4b09830d77f0c00cebbe0c85314c8bd4034",
    );
  });

  test("sha384", async () => {
    expect(await sha384(input)).toBe(
      "2fc21780749668c478381a492e045579956c66839935e4eac297fbfee0270ae8553334ab882af246552e7be59fe5c41e",
    );
  });

  test("sha512", async () => {
    expect(await sha512(input)).toBe(
      "5a16c326523916abf35841f5118cc94b7b4c84d26a54a857a043ac816a43e5ff5d26a3549d9f6309107e96077811d03eb4576ca279ffde8f0c3a673a51b76b8b",
    );
  });
});
