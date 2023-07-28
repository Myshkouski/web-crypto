import { describe, expect, test } from "vitest";

import { bytesToHex, hexToBytes, stringToBytes } from "./helpers.js";

describe("hexToBytes", () => {
  test("simple", () => {
    expect(hexToBytes("010203")).toStrictEqual(new Uint8Array([1, 2, 3]));
  });
});

describe("bytesToHex", () => {
  test("simple", () => {
    expect(bytesToHex(new Uint8Array([1, 2, 3]))).toBe("010203");
  });
});

describe("vice versa", () => {
  const text =
    "3a89070d68831d836b0719fde2b146cadf92b2e6d32a52cab4f63d60e158b32f300c3f1d9472004acdb644f0703c656b894638123e18e9067b18d9780569668b42daef21dfb9";

  test("hex -> bytes -> hex", () => {
    expect(bytesToHex(hexToBytes(text))).toBe(text);
  });

  test("bytes -> hex -> bytes", () => {
    const bytes = new Uint8Array([
      193, 207, 242, 244, 1, 107, 245, 242, 209, 132, 179, 208, 8, 111, 135, 26,
      183, 86, 45, 197, 2, 198, 90, 53, 216, 243, 42, 217, 159, 164, 215, 194,
      0, 27, 218, 44, 145, 177, 176, 98, 163, 64, 211, 92, 16, 4, 35, 139, 234,
      3, 70, 200, 141, 249, 159, 161, 211, 230, 239, 223, 130, 228, 160, 85,
    ]);
    expect(hexToBytes(bytesToHex(bytes))).toStrictEqual(bytes);
  });
});

describe("stringToBytes", () => {
  test("utf8 -> bytes -> hex", () => {
    const actualInput = "Some text to convert";
    const expectedOutput = "536f6d65207465787420746f20636f6e76657274";
    const actualOutput = bytesToHex(stringToBytes(actualInput));
    expect(actualOutput).toBe(expectedOutput);
  });
});
