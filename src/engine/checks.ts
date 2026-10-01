import type { Check, GameState } from "./types";

/** Energy at or below this level makes every challenge harder. */
export const LOW_ENERGY = 3;

/** The difficulty actually used for a check, after tiredness. */
export function effectiveDifficulty(s: GameState, check: Check): number {
  return s.meters.energy <= LOW_ENERGY ? Math.round(check.difficulty * 1.25) : check.difficulty;
}

/**
 * Success chance in whole percent: 60% when the attribute equals the difficulty,
 * scaling linearly and capped at 100. The UI shows exactly this number, and the
 * roll uses exactly this number. NeathBound's first bug was a UI that lied about
 * its rolls; this game does not get to repeat it.
 */
export function successChance(s: GameState, check: Check): number {
  const level = s.attributes[check.attribute];
  const chance = Math.floor((60 * level) / effectiveDifficulty(s, check));
  return Math.max(0, Math.min(100, chance));
}
