import { subtle } from "uncrypto";

import { randomBytes, stringToBytes } from "./helpers.js";

const AesGcmIdentifier: AlgorithmIdentifier = {
  name: "AES-GCM",
};

const AesKwIdentifier: AlgorithmIdentifier = {
  name: "AES-KW",
};

const DEFAULT_DERIVE_OPTIONS = {
  name: "PBKDF2",
  iterations: 1e5,
  hash: "SHA-256",
};

export const createPasswordHash = async (
  password: string,
  alg = DEFAULT_DERIVE_OPTIONS,
) => {
  const hash = await subtle.importKey(
    "raw",
    stringToBytes(password),
    alg,
    false,
    ["deriveKey"],
  );

  return { hash, alg };
};

export const createPassphrase = async (
  key: CryptoKey,
  salt?: string,
  kwOptions = AesKwIdentifier,
  kdOptions = DEFAULT_DERIVE_OPTIONS,
) => {
  const saltBytes = salt ? stringToBytes(salt) : randomBytes();

  const passphrase = await subtle.deriveKey(
    { ...kdOptions, salt: saltBytes },
    key,
    kwOptions,
    true,
    ["wrapKey", "unwrapKey"],
  );

  return { passphrase, salt: saltBytes, alg: kwOptions };
  // return await crypto.subtle.exportKey('jwk', passphrase)
};

export const generateSecretKey = async (
  options: { extractable?: boolean } = {},
  alg = AesGcmIdentifier,
) => {
  const key = await subtle.generateKey(alg, !!options.extractable, [
    "encrypt",
    "decrypt",
  ]);

  return { key, alg };
};
