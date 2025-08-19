let aesKey;
const iv = crypto.getRandomValues(new Uint8Array(12));

async function generateKey() {
  aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptMessage(message) {
  const encoded = new TextEncoder().encode(message);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, encoded);
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

async function decryptMessage(encryptedBase64) {
  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, encryptedBytes);
  return new TextDecoder().decode(decrypted);
}