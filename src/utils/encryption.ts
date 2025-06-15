
// Simple encryption utility for basic API key protection
const ENCRYPTION_KEY = 'auraluxx-secure-2024';

export const encryptKey = (key: string): string => {
  let encrypted = '';
  for (let i = 0; i < key.length; i++) {
    const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    const textChar = key.charCodeAt(i);
    encrypted += String.fromCharCode(textChar ^ keyChar);
  }
  return btoa(encrypted);
};

export const decryptKey = (encryptedKey: string): string => {
  const encrypted = atob(encryptedKey);
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    const textChar = encrypted.charCodeAt(i);
    decrypted += String.fromCharCode(textChar ^ keyChar);
  }
  return decrypted;
};
