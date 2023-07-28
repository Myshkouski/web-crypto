import { getRandomValues } from "uncrypto";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const stringToBytes = (input: string) => encoder.encode(input);
export const bytesToString = (input: ArrayBufferLike) => decoder.decode(input);

export const hexToBytes = (input: string): Uint8Array => {
  const output = new Uint8Array(input.length / 2);
  for (let i = 0; i < output.length; i++) {
    const sliceStart = i * 2;
    const hex = input.slice(sliceStart, sliceStart + 2);
    output[i] = parseInt(hex, 16);
  }
  return output;
};

export const bytesToHex = (input: ArrayBufferLike): string => {
  const bytes = new Uint8Array(input);
  const output = bytes.reduce(
    (acc, byte) => acc + ("0" + (byte & 0xff).toString(16)).slice(-2),
    "",
  );
  return output;
};

// base64 string -> uint8array
// const toBuffer = (string: string) => new Uint8Array(encode(string))
// uint8array -> base64 string
// const toBase64 = (array: ArrayBufferLike) => decode(new Uint8Array(array))
// const isBase64 = string => /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(string)

// const _createDict = (ranges: Uint8Array[]) => {
//   const dict = [];

//   for (const range of ranges) {
//     for (let i = range[0]; i <= range[1]; ++i) {
//       dict.push(i);
//     }
//   }

//   return new Uint8Array(dict);
// };

// const numbersRange = new Uint8Array([0x30, 0x39]);
// const upperCaseLetters = new Uint8Array([0x41, 0x5a]);
// const lowerCaseLetters = new Uint8Array([0x61, 0x7a]);
// const saveDict = _createDict([
//   numbersRange,
//   upperCaseLetters,
//   lowerCaseLetters,
// ]);
// const letterDict = _createDict([upperCaseLetters, lowerCaseLetters]);
// const extendedDict = _createDict([new Uint8Array([0x21, 0x7e])]);

// const _getRandomBuffer = (length: number, dict?: Uint8Array) => {
const _randomBytes = (length: number): Uint8Array => {
  const array = getRandomValues<Uint8Array>(new Uint8Array(length));

  // TODO: implement actually random logic
  // if (dict) {
  //   array = array.map(n => dict[n % dict.length]);
  // }

  return array;
};

export const randomBytes = (length: number = 32) => _randomBytes(length);

export type Encoding = "utf8" | "base64" | "hex";

// export const getRandomLetterString = (length: number) => bytesToString(_getRandomBuffer(length, letterDict));

// export const getRandomPassword = (length: number) => bytesToString(_getRandomBuffer(length, saveDict));

// export const getRandomString = (
//   length = 32,
//   encoding: Encoding = "utf8",
//   save = false
// ) => {
//   const buffer = _getRandomBuffer(length, save ? saveDict : undefined);

//   if (encoding == "hex") {
//     return bytesToHex(buffer);
//   }

//   const string = bytesToString(buffer);

//   if (encoding == "utf8") {
//     return string;
//   }

//   if (encoding == "base64") {
//     return btoa(string);
//   }

//   throw new Error(`Unsupported encoding: "${encoding}"`);
// };
