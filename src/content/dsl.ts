// Small builders so storylet files read like prose, not plumbing.
import type { Attribute, Effect, EvidenceStatus, Meter, TrustGroup } from "../engine/types";

export const meter = (m: Meter, delta: number): Effect => ({ kind: "meter", meter: m, delta });
export const quality = (key: string, delta = 1): Effect => ({ kind: "quality", key, delta });
export const set = (key: string, value = 1): Effect => ({ kind: "setQuality", key, value });
export const attr = (a: Attribute, delta: number): Effect => ({ kind: "attribute", attribute: a, delta });
export const trust = (group: TrustGroup, delta: number): Effect => ({ kind: "trust", group, delta });
export const family = (activity: string, base: number): Effect => ({ kind: "family", activity, base });
export const journal = (text: string, status?: EvidenceStatus): Effect => ({ kind: "journal", text, status });
export const trait = (id: string, t: string, replace?: string): Effect => ({ kind: "addTrait", id, trait: t, replace });
