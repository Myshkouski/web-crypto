import { subtle } from "uncrypto";

import { bytesToHex, stringToBytes } from "./helpers.js";

export enum DigestAlgorithmName {
  SHA_1 = "SHA-1",
  SHA_256 = "SHA-256",
  SHA_384 = "SHA-384",
  SHA_512 = "SHA-512",
}

// export type DigestAlgorithmName = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
interface DigestAlgorithmIdentifier extends Algorithm {
  name: DigestAlgorithmName;
}

const digest = async (input: string, params: DigestAlgorithmIdentifier) => {
  const bytes = await subtle.digest(params, stringToBytes(input));
  return bytesToHex(bytes);
};

export const sha1 = (input: string) =>
  digest(input, { name: DigestAlgorithmName.SHA_1 });
export const sha256 = (input: string) =>
  digest(input, { name: DigestAlgorithmName.SHA_256 });
export const sha384 = (input: string) =>
  digest(input, { name: DigestAlgorithmName.SHA_384 });
export const sha512 = (input: string) =>
  digest(input, { name: DigestAlgorithmName.SHA_512 });
