// Core data shapes for SIGNAL BENEATH.
// The engine is deterministic: all randomness comes from the seeded RNG held in GameState,
// so a save file plus a sequence of choices always reproduces the same story.

export const ATTRIBUTES = [
  "watchful",
  "practical",
  "persuasive",
  "steady",
  "curious",
  "discernment",
] as const;
export type Attribute = (typeof ATTRIBUTES)[number];

export const PHASES = ["morning", "day", "evening", "night"] as const;
export type Phase = (typeof PHASES)[number];

export const TRUST_GROUPS = ["family", "colleagues", "clients", "institutions", "ai"] as const;
export type TrustGroup = (typeof TRUST_GROUPS)[number];

export type Region =
  | "home"
  | "dadlan"
  | "rack"
  | "workshop"
  | "chemist"
  | "hospital"
  | "datacentre"
  | "archive"
  | "neathbound";

/** Numeric meters. Noise is tracked but never shown as a number to the player. */
export type Meter =
  | "energy"
  | "attention"
  | "sleepDebt"
  | "familyConnection"
  | "systemStability"
  | "techDebt"
  | "noise";

export type EvidenceStatus = "confirmed" | "probable" | "unverified" | "false-attribution";

export interface JournalEntry {
  day: number;
  text: string;
  status?: EvidenceStatus;
}

export interface Machine {
  id: string;
  name: string;
  role: string;
  traits: string[];
  storage: string;
  os: string;
  /** 0..100 */
  reliability: number;
  /** Which part of the network the machine is plugged into, for the diagram. */
  port: string;
  retired?: boolean;
}

export interface FamilyMoment {
  day: number;
  activity: string;
}

export interface GameState {
  version: 1;
  seed: number;
  rngState: number;
  name: string;
  day: number;
  phase: Phase;
  /** Actions taken during the current night beyond going to bed. */
  nightActions: number;
  attributes: Record<Attribute, number>;
  meters: Record<Meter, number>;
  trust: Record<TrustGroup, number>;
  /** Story progress, lessons, items and flags. Missing keys read as 0. */
  qualities: Record<string, number>;
  machines: Record<string, Machine>;
  familyMoments: FamilyMoment[];
  journal: JournalEntry[];
  /** Storylet currently open (a multi-step scene), if any. */
  current: string | null;
  /** Outcome of the most recent choice, shown above the next scene. */
  lastOutcome: OutcomeReport | null;
  ended: boolean;
}

export type Effect =
  | { kind: "quality"; key: string; delta: number }
  | { kind: "setQuality"; key: string; value: number }
  | { kind: "meter"; meter: Meter; delta: number }
  | { kind: "attribute"; attribute: Attribute; delta: number }
  | { kind: "trust"; group: TrustGroup; delta: number }
  /** Family time with diminishing returns for repeating the same activity. */
  | { kind: "family"; activity: string; base: number }
  | { kind: "machine"; id: string; patch: Partial<Omit<Machine, "id">> }
  | { kind: "addTrait"; id: string; trait: string; replace?: string }
  | { kind: "journal"; text: string; status?: EvidenceStatus };

export interface Outcome {
  text: string;
  effects?: Effect[];
  /** Continue into another storylet as part of the same scene. */
  next?: string;
  /** Close the scene and move to the next phase of the day. */
  advance?: boolean;
}

export interface Check {
  attribute: Attribute;
  difficulty: number;
}

export type Predicate = (s: GameState) => boolean;

export interface Choice {
  id: string;
  label: string;
  /** Extra flavour shown under the label. */
  hint?: string;
  requires?: Predicate;
  /** Shown when `requires` fails. Choices without one are hidden instead. */
  lockedReason?: string;
  attention?: number;
  energy?: number;
  check?: Check;
  success: Outcome;
  /** Required whenever `check` is set (enforced by content tests). */
  failure?: Outcome;
}

export interface Storylet {
  id: string;
  title: string;
  region: Region;
  phases: Phase[];
  text: string | ((s: GameState) => string);
  /** Whether the storylet appears in the phase menu. Scenes reached via `next` skip this. */
  requires?: Predicate;
  /** Hidden once the quality `done:<id>` is set; set automatically when an outcome closes it. */
  once?: boolean;
  /** Only reachable through another storylet's `next`. */
  sceneOnly?: boolean;
  /** Higher sorts first in the menu. Urgent events use this. */
  priority?: number;
  choices: Choice[];
}

export interface OutcomeReport {
  storyletTitle: string;
  choiceLabel: string;
  check?: { attribute: Attribute; difficulty: number; chance: number; roll: number; success: boolean };
  text: string;
  changes: string[];
}
