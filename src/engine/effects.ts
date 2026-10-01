import { MAX_ENERGY } from "./state";
import type { Effect, GameState, Meter } from "./types";

const METER_LABELS: Record<Meter, string> = {
  energy: "Energy",
  attention: "Attention",
  sleepDebt: "Sleep debt",
  familyConnection: "Family Connection",
  systemStability: "System Stability",
  techDebt: "Tech Debt",
  noise: "Noise",
};

const METER_BOUNDS: Partial<Record<Meter, [number, number]>> = {
  energy: [0, MAX_ENERGY],
  attention: [0, 99],
  sleepDebt: [0, 99],
  systemStability: [0, 100],
  techDebt: [0, 99],
  noise: [0, 20],
  familyConnection: [0, 100],
};

/** Days of history that count towards repetition when scoring family time. */
export const FAMILY_MEMORY_DAYS = 3;

/**
 * Family Connection cannot be farmed: repeating the same activity within a few days
 * halves, then thirds, the gain, down to nothing.
 */
export function familyGain(s: GameState, activity: string, base: number): number {
  const recent = s.familyMoments.filter(
    (m) => m.activity === activity && m.day > s.day - FAMILY_MEMORY_DAYS,
  ).length;
  return Math.floor(base / (1 + recent));
}

function signed(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

export function adjustMeter(s: GameState, meter: Meter, delta: number): number {
  const [lo, hi] = METER_BOUNDS[meter] ?? [-999, 999];
  const before = s.meters[meter];
  s.meters[meter] = Math.max(lo, Math.min(hi, before + delta));
  return s.meters[meter] - before;
}

export function describeMeterChange(meter: Meter, applied: number): string | null {
  if (applied === 0) return null;
  // Noise is a hidden variable: the player feels it, but never sees the number.
  if (meter === "noise") return applied > 0 ? "The house feels a little louder." : "Something quietens.";
  return `${METER_LABELS[meter]} ${signed(applied)}`;
}

/** Applies effects in place and returns human-readable change lines. */
export function applyEffects(s: GameState, effects: readonly Effect[]): string[] {
  const changes: string[] = [];
  for (const e of effects) {
    switch (e.kind) {
      case "quality":
        s.qualities[e.key] = (s.qualities[e.key] ?? 0) + e.delta;
        break;
      case "setQuality":
        s.qualities[e.key] = e.value;
        break;
      case "meter": {
        const line = describeMeterChange(e.meter, adjustMeter(s, e.meter, e.delta));
        if (line) changes.push(line);
        break;
      }
      case "attribute":
        s.attributes[e.attribute] += e.delta;
        changes.push(`${capitalise(e.attribute)} ${signed(e.delta)}`);
        break;
      case "trust":
        s.trust[e.group] += e.delta;
        changes.push(`Trust (${e.group}) ${signed(e.delta)}`);
        break;
      case "family": {
        const gain = familyGain(s, e.activity, e.base);
        s.familyMoments.push({ day: s.day, activity: e.activity });
        const applied = adjustMeter(s, "familyConnection", gain);
        changes.push(
          applied > 0
            ? `Family Connection +${applied}`
            : "Family Connection unchanged — they can tell when it's routine.",
        );
        break;
      }
      case "machine": {
        const m = s.machines[e.id];
        if (!m) throw new Error(`Unknown machine ${e.id}`);
        Object.assign(m, e.patch);
        changes.push(`${m.name} updated`);
        break;
      }
      case "addTrait": {
        const m = s.machines[e.id];
        if (!m) throw new Error(`Unknown machine ${e.id}`);
        if (e.replace) m.traits = m.traits.filter((t) => t !== e.replace);
        if (!m.traits.includes(e.trait)) m.traits.push(e.trait);
        changes.push(`${m.name}: ${e.replace ? `${e.replace} → ` : ""}${e.trait}`);
        break;
      }
      case "journal":
        s.journal.push({ day: s.day, text: e.text, status: e.status });
        changes.push("Journal updated");
        break;
    }
  }
  return changes;
}

export function capitalise(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
