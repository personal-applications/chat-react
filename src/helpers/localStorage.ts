export const JWT_KEY = "jwt";

export function saveToLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export function deleteFromLocalStorage(key: string): void {
  localStorage.removeItem(key);
}