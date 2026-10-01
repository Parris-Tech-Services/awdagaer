import { effectiveDifficulty, successChance } from "./checks";
import { adjustMeter, applyEffects, describeMeterChange } from "./effects";
import { nextRandom } from "./rng";
import { DAILY_ATTENTION, MAX_ENERGY } from "./state";
import type { Choice, GameState, Outcome, OutcomeReport, Phase, Storylet } from "./types";
import { PHASES } from "./types";

export type StoryletIndex = ReadonlyMap<string, Storylet>;

export function indexStorylets(list: readonly Storylet[]): StoryletIndex {
  const map = new Map<string, Storylet>();
  for (const s of list) {
    if (map.has(s.id)) throw new Error(`Duplicate storylet id ${s.id}`);
    map.set(s.id, s);
  }
  return map;
}

export const q = (s: GameState, key: string): number => s.qualities[key] ?? 0;

export function isDone(s: GameState, id: string): boolean {
  return q(s, `done:${id}`) > 0;
}

/** Storylets offered in the current phase's menu, most urgent first. */
export function menu(s: GameState, index: StoryletIndex): Storylet[] {
  return [...index.values()]
    .filter(
      (st) =>
        !st.sceneOnly &&
        st.phases.includes(s.phase) &&
        !(st.once && isDone(s, st.id)) &&
        !(st.daily && q(s, `daily:${st.id}`) === s.day) &&
        (st.requires ? st.requires(s) : true),
    )
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

export interface ChoiceStatus {
  visible: boolean;
  enabled: boolean;
  reason?: string;
  chance?: number;
  difficulty?: number;
}

export function choiceStatus(s: GameState, choice: Choice): ChoiceStatus {
  if (choice.requires && !choice.requires(s)) {
    return choice.lockedReason
      ? { visible: true, enabled: false, reason: choice.lockedReason }
      : { visible: false, enabled: false };
  }
  const check = choice.check
    ? { chance: successChance(s, choice.check), difficulty: effectiveDifficulty(s, choice.check) }
    : {};
  if ((choice.attention ?? 0) > s.meters.attention) {
    return { visible: true, enabled: false, reason: "Not enough Attention left today.", ...check };
  }
  if ((choice.energy ?? 0) > s.meters.energy) {
    return { visible: true, enabled: false, reason: "Too tired.", ...check };
  }
  return { visible: true, enabled: true, ...check };
}

function clone(s: GameState): GameState {
  return structuredClone(s);
}

export function openStorylet(state: GameState, index: StoryletIndex, id: string): GameState {
  const st = index.get(id);
  if (!st) throw new Error(`Unknown storylet ${id}`);
  if (state.current) throw new Error("A scene is already open");
  if (!menu(state, index).includes(st)) throw new Error(`Storylet ${id} is not available now`);
  const s = clone(state);
  s.current = id;
  s.lastOutcome = null;
  return s;
}

/** Back out of a storylet before committing to any choice. Mid-scene steps cannot be abandoned. */
export function closeStorylet(state: GameState, index: StoryletIndex): GameState {
  const st = state.current ? index.get(state.current) : undefined;
  if (!st || st.sceneOnly) return state;
  const s = clone(state);
  s.current = null;
  return s;
}

export function choose(state: GameState, index: StoryletIndex, choiceId: string): GameState {
  if (state.ended) throw new Error("The chapter has ended");
  if (!state.current) throw new Error("No storylet open");
  const st = index.get(state.current);
  if (!st) throw new Error(`Unknown storylet ${state.current}`);
  const choice = st.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error(`Unknown choice ${choiceId} in ${st.id}`);
  const status = choiceStatus(state, choice);
  if (!status.enabled) throw new Error(`Choice ${choiceId} is unavailable: ${status.reason ?? "hidden"}`);

  const s = clone(state);
  const changes: string[] = [];
  const pay = (meter: "attention" | "energy", cost?: number) => {
    if (!cost) return;
    const line = describeMeterChange(meter, adjustMeter(s, meter, -cost));
    if (line) changes.push(line);
  };
  pay("attention", choice.attention);
  pay("energy", choice.energy);

  let outcome: Outcome = choice.success;
  let checkReport: OutcomeReport["check"];
  if (choice.check) {
    // Use the chance the player was shown, before this choice's own costs were paid.
    const chance = successChance(state, choice.check);
    const r = nextRandom(s.rngState);
    s.rngState = r.state;
    const roll = Math.floor(r.value * 100); // 0..99
    const success = roll < chance;
    checkReport = {
      attribute: choice.check.attribute,
      difficulty: effectiveDifficulty(state, choice.check),
      chance,
      roll,
      success,
    };
    if (!success) {
      if (!choice.failure) throw new Error(`Choice ${choiceId} has a check but no failure outcome`);
      outcome = choice.failure;
    } else if (choice.check.attribute !== "discernment") {
      // Practice makes a little progress. Discernment is never learned by winning rolls.
      s.attributes[choice.check.attribute] += 1;
      changes.push(`${choice.check.attribute[0]!.toUpperCase()}${choice.check.attribute.slice(1)} +1`);
    }
  }

  if (s.phase === "night") {
    // Every action after dark costs more sleep than the last.
    s.nightActions += 1;
    const line = describeMeterChange("sleepDebt", adjustMeter(s, "sleepDebt", s.nightActions));
    if (line) changes.push(line);
  }

  changes.push(...applyEffects(s, outcome.effects ?? []));
  if (st.once) s.qualities[`done:${st.id}`] = 1;
  if (st.daily) s.qualities[`daily:${st.id}`] = s.day;
  if (q(s, "game:ended") > 0) s.ended = true;

  s.lastOutcome = {
    storyletTitle: st.title,
    choiceLabel: choice.label,
    check: checkReport,
    text: outcome.text,
    changes,
  };

  if (outcome.next) {
    if (!index.has(outcome.next)) throw new Error(`Unknown next storylet ${outcome.next}`);
    s.current = outcome.next;
  } else {
    s.current = null;
  }
  if (outcome.advance) return advanceFrom(s);
  return s;
}

const NEXT_PHASE: Record<Phase, Phase | null> = { morning: "day", day: "evening", evening: "night", night: null };

export function phaseLabel(p: Phase): string {
  return { morning: "Morning", day: "Day", evening: "Evening", night: "Night" }[p];
}

export function advancePhase(state: GameState): GameState {
  if (state.current) throw new Error("Finish the current scene first");
  return advanceFrom(clone(state));
}

function advanceFrom(s: GameState): GameState {
  s.current = null;
  const next = NEXT_PHASE[s.phase];
  if (next) {
    s.phase = next;
    return s;
  }
  sleep(s);
  return s;
}

/** Overnight recovery. Sleep debt eats into rest; Noise eats into tomorrow's Attention. */
function sleep(s: GameState): void {
  const rest = Math.max(1, 6 - s.meters.sleepDebt);
  s.meters.energy = Math.min(MAX_ENERGY, s.meters.energy + rest);
  s.meters.sleepDebt = Math.floor(s.meters.sleepDebt / 2);
  s.meters.noise = Math.max(0, s.meters.noise - 1);
  s.meters.attention = Math.max(3, DAILY_ATTENTION - Math.floor(s.meters.noise / 4));
  s.nightActions = 0;
  s.day += 1;
  s.phase = PHASES[0];
}
