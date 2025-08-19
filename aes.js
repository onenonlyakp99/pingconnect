function encrypt(data, key) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

function decrypt(ciphertext, key) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
