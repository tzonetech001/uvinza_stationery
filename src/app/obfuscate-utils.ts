// This file helps obfuscate critical functions
export function obfuscateString(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ 0x7F);
  }
  return result;
}

export function deobfuscateString(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ 0x7F);
  }
  return result;
}

// Store sensitive strings in obfuscated form
export const OBFUSCATED_STRINGS = {
  ADMIN_USERNAME: obfuscateString('admin'),
  API_ENDPOINT: obfuscateString('https://api.uvinzastationery.com')
};