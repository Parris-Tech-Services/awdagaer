import type { GameState } from "./types";

const KEY = "signal-beneath:save";

export function serialise(s: GameState): string {
  return JSON.stringify(s);
}

export function deserialise(raw: string): GameState | null {
  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (parsed?.version !== 1 || typeof parsed.day !== "number") return null;
    return parsed as GameState;
  } catch {
    return null;
  }
}

export function saveToStorage(s: GameState): void {
  try {
    localStorage.setItem(KEY, serialise(s));
  } catch {
    // Storage can be unavailable (private mode, blocked site data). The game still runs.
  }
}

export function loadFromStorage(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? deserialise(raw) : null;
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
