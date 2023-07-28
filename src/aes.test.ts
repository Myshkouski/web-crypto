import { describe, expect, test } from "vitest";

import { aesDecrypt, aesEncrypt, importAesKey } from "./aes.js";
import { bytesToHex, stringToBytes } from "./helpers.js";

describe("aes", () => {
  const hexInput = bytesToHex(
    stringToBytes("This is sample text to test aes encryption"),
  );
  const hexSecretKey = "28cd2782e9e6ee4e765f99fc4d1730ea";

  describe("128", () => {
    describe("import key", () => {
      test("cbc", async () => {
        const key = await importAesKey(hexSecretKey, "AES-CBC", 128);
        expect(key.algorithm.length).toBe(128);
        expect(key.algorithm.name).toBe("AES-CBC");
      });

      test("gcm", async () => {
        const key = await importAesKey(hexSecretKey, "AES-GCM", 128);
        expect(key.algorithm.name).toBe("AES-GCM");
      });
    });

    test("cbc", async () => {
      const cipherText = await aesEncrypt(
        hexInput,
        await importAesKey(hexSecretKey, "AES-CBC", 128, ["encrypt"]),
      );
      const decrypted = await aesDecrypt(
        cipherText,
        await importAesKey(hexSecretKey, "AES-CBC", 128, ["decrypt"]),
      );
      expect(decrypted).toBe(hexInput);
    });

    test("gcm", async () => {
      const cipherText = await aesEncrypt(
        hexInput,
        await importAesKey(hexSecretKey, "AES-GCM", 128, ["encrypt"]),
      );
      const decrypted = await aesDecrypt(
        cipherText,
        await importAesKey(hexSecretKey, "AES-GCM", 128, ["decrypt"]),
      );
      expect(decrypted).toBe(hexInput);
    });
  });

  // describe('256', () => {
  //   const keySize = 256
  //   describe('import key', () => {
  //     test('cbc', async () => {
  //       const key = await importAesKey(hexSecretKey, 'AES-CBC', keySize)
  //       expect(key.algorithm.name).toBe('AES-CBC')
  //     })

  //     test('gcm', async () => {
  //       const key = await importAesKey(hexSecretKey, 'AES-GCM', keySize)
  //       expect(key.algorithm.name).toBe('AES-GCM')
  //     })
  //   })

  //   test('cbc', async () => {
  //     const cipherText = await aesEncrypt(hexInput, await importAesKey(hexSecretKey, 'AES-CBC', keySize, ['encrypt']))
  //     const decrypted = await aesEncrypt(cipherText, await importAesKey(hexSecretKey, 'AES-CBC', keySize, ['decrypt']))
  //     console.log(hexToBytes(hexInput))
  //     console.log(hexToBytes(decrypted))
  //     expect(decrypted).toBe(hexInput)
  //   })

  //   test('gcm', async () => {
  //     const cipherText = await aesEncrypt(hexInput, await importAesKey(hexSecretKey, 'AES-GCM', keySize, ['encrypt']))
  //     const decrypted = await aesEncrypt(cipherText, await importAesKey(hexSecretKey, 'AES-GCM', keySize, ['decrypt']))
  //     expect(decrypted).toBe(hexInput)
  //   })
  // })
});
