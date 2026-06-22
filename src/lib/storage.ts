const STORAGE_PREFIX = 'pickem:';

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_PREFIX + key);
}

export function loadAllPredictions<T>(prefix: string): Record<string, T> {
  if (typeof window === 'undefined') return {};
  const results: Record<string, T> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX + prefix)) {
      try {
        const id = key.slice((STORAGE_PREFIX + prefix).length);
        results[id] = JSON.parse(localStorage.getItem(key)!) as T;
      } catch {
        // Skip invalid entries
      }
    }
  }
  return results;
}
