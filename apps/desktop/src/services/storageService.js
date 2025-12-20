import CryptoJS from 'crypto-js';
const KEY = 'loanlife-edge-key';

export function saveEncrypted(name, obj) {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), KEY).toString();
  localStorage.setItem(name, ciphertext);
}

export function loadEncrypted(name) {
  const cipher = localStorage.getItem(name);
  if (!cipher) return null;
  const bytes = CryptoJS.AES.decrypt(cipher, KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
