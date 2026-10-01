import type { GameState } from "./types";

export const SLOTS = [1, 2, 3] as const;
export type Slot = (typeof SLOTS)[number];

const key = (slot: Slot) => `signal-beneath:slot${slot}`;
const LEGACY_KEY = "signal-beneath:save";
const LAST_SLOT_KEY = "signal-beneath:last-slot";

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

// Storage can throw or be empty (private mode, blocked site data). The game must still run.
function read(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function write(k: string, v: string): void {
  try {
    localStorage.setItem(k, v);
  } catch {
    // ignore
  }
}
function remove(k: string): void {
  try {
    localStorage.removeItem(k);
  } catch {
    // ignore
  }
}

/** Saves from before slots existed move into slot 1 the first time they're seen. */
function migrateLegacy(): void {
  const legacy = read(LEGACY_KEY);
  if (legacy && !read(key(1))) write(key(1), legacy);
  if (legacy) remove(LEGACY_KEY);
}

export function saveSlot(slot: Slot, s: GameState): void {
  write(key(slot), serialise(s));
  write(LAST_SLOT_KEY, String(slot));
}

export function loadSlot(slot: Slot): GameState | null {
  migrateLegacy();
  const raw = read(key(slot));
  return raw ? deserialise(raw) : null;
}

export function clearSlot(slot: Slot): void {
  remove(key(slot));
}

export function lastSlot(): Slot | null {
  migrateLegacy();
  const n = Number(read(LAST_SLOT_KEY));
  return (SLOTS as readonly number[]).includes(n) ? (n as Slot) : null;
}
