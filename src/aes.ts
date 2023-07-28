import { subtle } from "uncrypto";

import { bytesToHex, hexToBytes, randomBytes } from "./helpers.js";

export type AesAlgorithmName = "AES-CBC" | "AES-GCM" | "AES-CTR";
export type AesKeySize = 128 | 256;

export type AesKey<
  N extends AesAlgorithmName = AesAlgorithmName,
  S extends AesKeySize = AesKeySize,
> = CryptoKey & {
  readonly algorithm: AesKeyAlgorithm & {
    readonly name: N;
    readonly length: S;
  };
};

const DEFAULT_AES_KEY_USAGES: KeyUsage[] = ["encrypt", "decrypt"];

/**
 *
 * See [SubtleCrypto: importKey() docs](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#syntax) for more info
 * @param hexInput key, encoded in hexademical chars
 * @param name algorithm name
 * @param length key size (in bits)
 * @param usages allowed key usages
 */
export async function importAesKey<
  N extends AesAlgorithmName,
  L extends AesKeySize,
>(
  hexInput: string,
  name: N,
  length: L,
  usages?: KeyUsage[],
): Promise<AesKey<N, L>>;
export async function importAesKey<N extends AesAlgorithmName>(
  hexInput: string,
  name: N,
): Promise<AesKey<N, 128>>;
export async function importAesKey(
  hexInput: string,
): Promise<AesKey<"AES-GCM", 128>>;
export async function importAesKey(
  hexInput: string,
  name: AesAlgorithmName = "AES-GCM",
  length: AesKeySize = 128,
  usages: KeyUsage[] = DEFAULT_AES_KEY_USAGES,
): Promise<AesKey> {
  return (await subtle.importKey(
    "raw",
    hexToBytes(hexInput),
    { name, length },
    false,
    usages,
  )) as AesKey;
}

const AES_IV_LENGTH = 16;

const _aesEncrypt = async (
  input: ArrayBufferLike,
  params: AesCtrParams | AesCbcParams | AesGcmParams,
  secretKey: AesKey,
) => {
  const cipherText = await subtle.encrypt(params, secretKey, input);

  return bytesToHex(cipherText);
};

type AesIvParams = AesCbcParams | AesGcmParams;

const aesIvEncrypt = async (
  input: ArrayBufferLike,
  key: AesKey<"AES-CBC" | "AES-GCM">,
) => {
  const iv = randomBytes(AES_IV_LENGTH);
  const params: AesIvParams = {
    name: key.algorithm.name,
    iv,
  };

  const hexCipherText = await _aesEncrypt(input, params, key);

  return bytesToHex(iv) + hexCipherText;
};

const _aesDecrypt = async (
  cipherText: BufferSource,
  params: AesCtrParams | AesCbcParams | AesGcmParams,
  key: AesKey,
) => {
  const bytes = await subtle.decrypt(params, key, cipherText);
  return bytesToHex(bytes);
};

const aesIvDecrypt = (input: ArrayBufferLike, key: AesKey) => {
  const iv = input.slice(0, AES_IV_LENGTH);
  const cipherText = input.slice(AES_IV_LENGTH);

  const params: AesIvParams = {
    name: key.algorithm.name,
    iv,
  };

  return _aesDecrypt(cipherText, params, key);
};

// const aesCtrEncrypt = (
//   input: ArrayBufferLike,
//   key: AesKey<'AES-CTR'>,
// ) => {
//   throw new Error('not implemented yet')
// }

// const aesCtrDecrypt = (
//   input: ArrayBufferLike,
//   key: AesKey<'AES-CTR'>,
// ) => {
//   throw new Error('not implemented yet')
// }

const keyAlgorithmRequiresIv = (
  key: AesKey,
): key is AesKey<"AES-CBC" | "AES-GCM"> =>
  ["AES-CBC", "AES-GCM"].includes(key.algorithm.name);

export const aesEncrypt = (hexInput: string, key: AesKey) => {
  const bytes = hexToBytes(hexInput);

  if (keyAlgorithmRequiresIv(key)) {
    return aesIvEncrypt(bytes, key);
  }

  throw new Error("AES-CTR encryption is not implemented yet");
  // return aesCtrEncrypt(
  //   bytes,
  //   key as AesKey<'AES-CTR'>
  // );
};

export const aesDecrypt = (
  input: string,
  secretKey: AesKey<AesAlgorithmName, 128>,
) => {
  const bytes = hexToBytes(input);

  if (keyAlgorithmRequiresIv(secretKey)) {
    return aesIvDecrypt(bytes, secretKey);
  }

  throw new Error("AES-CTR decryption is not implemented yet");
  // return aesCtrDecrypt(
  //   bytes,
  //   secretKey as AesKey<'AES-CTR'>
  // );
};
