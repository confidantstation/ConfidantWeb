import { Injectable } from '@angular/core';
import * as blake from 'blakejs';
import { BigNumber } from 'bignumber.js';

const nacl = window['nacl'];

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  hex = {
    toUint4: hexToUint4,
    fromUint8: uint8ToHex,
    toUint8: hexToUint8
  };

  uint4 = {
    toUint5: uint4ToUint5,
    toUint8: uint4ToUint8
  };

  uint5 = {
    toString: uint5ToString
  };

  uint8 = {
    toUint4: uint8ToUint4,
    fromHex: hexToUint8,
    toHex: uint8ToHex
  };

  dec = {
    toHex: decToHex
  };

  wallet = {
    generateWalletSecretKeyBytes,
    generateWalletKeyPair,
    getPublicWalletId,
    generateSeedBytes,
    getWalletPublicKey
  };

  qlc = {
    mqlcToRaw,
    kqlcToRaw,
    qlcToRaw,
    rawToMqlc,
    rawToKqlc,
    rawToQlc
  };

  b64 = {
    encodeUnicode: b64EncodeUnicode,
    decodeUnicode: b64DecodeUnicode
  };
}

/** b64 Functions */
function b64EncodeUnicode(str): string {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1): string {
      return String.fromCharCode(Number('0x' + p1));
    }));
}

function b64DecodeUnicode(str): string {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}


/** Hex Functions */
function hexToUint4(hexValue): Uint8Array {
  const uint4 = new Uint8Array(hexValue.length);
  for (let i = 0; i < hexValue.length; i++) {
    uint4[i] = parseInt(hexValue.substr(i, 1), 16);
  }

  return uint4;
}

function hexToUint8(hexString): Uint8Array {
  if (hexString.length % 2 > 0) {
    hexString = '0' + hexString;
  }
  const byteArray = [];
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  return Uint8Array.from(byteArray);
}

/** Uint4 Functions */
function uint4ToUint8(uintValue): Uint8Array {
  const length = uintValue.length / 2;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8[i] = uintValue[i * 2] * 16 + uintValue[i * 2 + 1];
  }

  return uint8;
}

function uint4ToUint5(uintValue): Uint8Array {
  const length = (uintValue.length / 5) * 4;
  const uint5 = new Uint8Array(length);
  for (let i = 1; i <= length; i++) {
    const n = i - 1;
    const m = i % 4;
    const z = n + (i - m) / 4;
    const right = uintValue[z] << m;
    let left;
    if ((length - i) % 4 === 0) {
      left = uintValue[z - 1] << 4;
    } else {
      left = uintValue[z + 1] >> (4 - m);
    }
    uint5[n] = (left + right) % 32;
  }
  return uint5;
}

function uint4ToHex(uint4): string {
  let hex = '';
  for (let i = 0; i < uint4.length; i++) {
    hex += uint4[i].toString(16);
  }
  return hex;
}

/** Uint5 Functions */
function uint5ToString(uint5): string {
  const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
  let string = '';
  for (let i = 0; i < uint5.length; i++) {
    string += letterList[uint5[i]];
  }

  return string;
}

function uint5ToUint4(uint5): Uint8Array {
  const length = (uint5.length / 4) * 5;
  const uint4 = new Uint8Array(length);
  for (let i = 1; i <= length; i++) {
    const n = i - 1;
    const m = i % 5;
    const z = n - (i - m) / 5;
    const right = uint5[z - 1] << (5 - m);
    const left = uint5[z] >> m;
    uint4[n] = (left + right) % 16;
  }
  return uint4;
}

/** Uint8 Functions */
function uint8ToHex(uintValue): string {
  let hex = '';
  let aux;
  for (let i = 0; i < uintValue.length; i++) {
    aux = uintValue[i].toString(16);
    if (aux.length === 1) {
      aux = '0' + aux;
    }
    hex += aux;
    aux = '';
  }

  return hex;
}

function uint8ToUint4(uintValue): Uint8Array {
  const uint4 = new Uint8Array(uintValue.length * 2);
  for (let i = 0; i < uintValue.length; i++) {
    uint4[i * 2] = (uintValue[i] / 16) | 0;
    uint4[i * 2 + 1] = uintValue[i] % 16;
  }

  return uint4;
}

/** Dec Functions */
function decToHex(decValue, bytes = null): string {
  const dec = decValue.toString().split('');
  const sum = [];
  const hexArray = [];
  let i;
  let s;
  while (dec.length) {
    s = 1 * dec.shift();
    for (i = 0; s || i < sum.length; i++) {
      s += (sum[i] || 0) * 10;
      sum[i] = s % 16;
      s = (s - sum[i]) / 16;
    }
  }
  while (sum.length) {
    hexArray.push(sum.pop().toString(16));
  }

  let hex = hexArray.join('');

  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  if (bytes > hex.length / 2) {
    const diff = bytes - hex.length / 2;
    for (let j = 0; j < diff; j++) {
      hex = '00' + hex;
    }
  }

  return hex;
}

/** String Functions */
function stringToUint5(string): Uint8Array {
  const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
  const length = string.length;
  const stringArray = string.split('');
  const uint5 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint5[i] = letterList.indexOf(stringArray[i]);
  }
  return uint5;
}

/** Wallet Functions */
function generateWalletSecretKeyBytes(seedBytes, walletIndex): Uint8Array {
  const walletBytes = hexToUint8(decToHex(walletIndex, 4));
  const context = blake.blake2bInit(32);
  blake.blake2bUpdate(context, seedBytes);
  blake.blake2bUpdate(context, walletBytes);
  return blake.blake2bFinal(context);
}

function generateWalletKeyPair(walletSecretKeyBytes): any {
  return nacl.sign.keyPair.fromSecretKey(walletSecretKeyBytes);
}

function getPublicWalletId(walletPublicKeyBytes): string {
  const walletHex = uint8ToHex(walletPublicKeyBytes);
  const keyBytes = uint4ToUint8(hexToUint4(walletHex)); // For some reason here we go from u, to hex, to 4, to 8??
  const checksum = uint5ToString(uint4ToUint5(uint8ToUint4(blake.blake2b(keyBytes, null, 5).reverse())));
  const wallet = uint5ToString(uint4ToUint5(hexToUint4(`0${walletHex}`)));

  return `qlc_${wallet}${checksum}`;
}

function getWalletPublicKey(wallet): string {
  const errWalletMessage = 'Invalid QLC Wallet';
  if ((!wallet.startsWith('qlc_1') && !wallet.startsWith('qlc_3')) || wallet.length !== 64) {
    throw new Error(errWalletMessage);
  }
  const walletCrop = wallet.substring(4, 64);
  const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(walletCrop);
  if (!isValid) {
    throw new Error(errWalletMessage);
  }

  const keyUint4 = arrayCrop(uint5ToUint4(stringToUint5(walletCrop.substring(0, 52))));
  const hashUint4 = uint5ToUint4(stringToUint5(walletCrop.substring(52, 60)));
  const keyArray = uint4ToUint8(keyUint4);
  const blakeHash = blake.blake2b(keyArray, null, 5).reverse();

  const errChecksumMessage = 'Incorrect checksum';
  if (!equalArrays(hashUint4, uint8ToUint4(blakeHash))) {
    throw new Error(errChecksumMessage);
  }

  return uint4ToHex(keyUint4);
}

/**
 * Conversion functions
 */
const Mqlc = 100000000000; // 10^11
const QLC = 100000000; // 10^8
const kqlc = 1000; // 10^3
// const qlc = 1; // 10^0

function mqlcToRaw(value): BigNumber {
  return new BigNumber(value).times(Mqlc);
}

function kqlcToRaw(value): BigNumber {
  return new BigNumber(value).times(kqlc);
}

function qlcToRaw(value): BigNumber {
  return new BigNumber(value).times(QLC);
}

function rawToMqlc(value): BigNumber {
  return new BigNumber(value).div(Mqlc);
}

function rawToKqlc(value): BigNumber {
  return new BigNumber(value).div(kqlc);
}

function rawToQlc(value): BigNumber {
  return new BigNumber(value).div(QLC);
}

function arrayCrop(array): Uint8Array {
  const length = array.length - 1;
  const croppedArray = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    croppedArray[i] = array[i + 1];
  }
  return croppedArray;
}

function equalArrays(array1, array2): boolean {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

function generateSeedBytes(): Buffer {
  return nacl.randomBytes(32);
}


const util = {
  hex: {
    toUint4: hexToUint4,
    fromUint8: uint8ToHex,
    toUint8: hexToUint8
  },
  uint4: {
    toUint5: uint4ToUint5,
    toUint8: uint4ToUint8
  },
  uint5: {
    toString: uint5ToString
  },
  uint8: {
    toUint4: uint8ToUint4,
    fromHex: hexToUint8,
    toHex: uint8ToHex
  },
  dec: {
    toHex: decToHex
  },
  wallet: {
    generateWalletSecretKeyBytes,
    generateWalletKeyPair,
    getPublicWalletId,
    generateSeedBytes,
    getWalletPublicKey
  },
  qlc: {
    mqlcToRaw,
    kqlcToRaw,
    qlcToRaw,
    rawToMqlc,
    rawToKqlc,
    rawToQlc
  },
  b64: {
    encodeUnicode: b64EncodeUnicode,
    decodeUnicode: b64DecodeUnicode
  }

};
