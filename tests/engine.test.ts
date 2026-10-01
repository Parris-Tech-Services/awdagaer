import { describe, expect, it } from "vitest";
import { successChance } from "../src/engine/checks";
import { familyGain, applyEffects } from "../src/engine/effects";
import { advancePhase, choose, indexStorylets, openStorylet } from "../src/engine/engine";
import { newGame } from "../src/engine/state";
import type { Storylet } from "../src/engine/types";

const coin: Storylet = {
  id: "coin",
  title: "Coin",
  region: "home",
  phases: ["morning", "day", "evening", "night"],
  text: "",
  choices: [
    {
      id: "flip",
      label: "Flip",
      energy: 5,
      check: { attribute: "watchful", difficulty: 30 },
      success: { text: "heads", effects: [{ kind: "quality", key: "heads", delta: 1 }] },
      failure: { text: "tails", effects: [{ kind: "quality", key: "tails", delta: 1 }] },
    },
  ],
};
const index = indexStorylets([coin]);

describe("challenge checks", () => {
  it("is 60% when attribute equals difficulty, capped at 100", () => {
    const s = newGame(1);
    expect(successChance(s, { attribute: "watchful", difficulty: 30 })).toBe(60);
    expect(successChance(s, { attribute: "watchful", difficulty: 10 })).toBe(100);
  });

  it("gets harder when energy is low", () => {
    const s = newGame(1);
    s.meters.energy = 3;
    expect(successChance(s, { attribute: "watchful", difficulty: 30 })).toBeLessThan(60);
  });

  it("rolls against the chance shown before the choice's own energy cost", () => {
    // The flip costs 5 energy, which would drop the player into low energy.
    // The roll must still use the chance displayed before paying.
    for (let seed = 0; seed < 50; seed++) {
      const s = openStorylet(newGame(seed), index, "coin");
      const after = choose(s, index, "flip");
      expect(after.lastOutcome?.check?.chance).toBe(60);
      expect(after.lastOutcome?.check?.success).toBe(after.lastOutcome!.check!.roll < 60);
      expect(after.lastOutcome?.text).toBe(after.lastOutcome?.check?.success ? "heads" : "tails");
    }
  });

  it("is deterministic for a given seed", () => {
    const run = () => choose(openStorylet(newGame(42), index, "coin"), index, "flip");
    expect(run()).toEqual(run());
  });
});

describe("family connection", () => {
  it("has diminishing returns for repeating the same activity", () => {
    const s = newGame(1);
    const start = s.meters.familyConnection;
    applyEffects(s, [{ kind: "family", activity: "reading", base: 6 }]);
    applyEffects(s, [{ kind: "family", activity: "reading", base: 6 }]);
    applyEffects(s, [{ kind: "family", activity: "reading", base: 6 }]);
    expect(s.meters.familyConnection - start).toBe(6 + 3 + 2);
    expect(familyGain(s, "board-games", 6)).toBe(6);
  });

  it("recovers once the repetition is a few days old", () => {
    const s = newGame(1);
    applyEffects(s, [{ kind: "family", activity: "reading", base: 6 }]);
    s.day += 3;
    expect(familyGain(s, "reading", 6)).toBe(6);
  });
});

describe("days and nights", () => {
  it("charges escalating sleep debt for night work", () => {
    let s = newGame(1);
    s = advancePhase(advancePhase(advancePhase(s)));
    expect(s.phase).toBe("night");
    s.meters.energy = 10;
    s = choose(openStorylet(s, index, "coin"), index, "flip");
    expect(s.meters.sleepDebt).toBe(1);
    s.meters.energy = 10;
    s = choose(openStorylet(s, index, "coin"), index, "flip");
    expect(s.meters.sleepDebt).toBe(3);
  });

  it("starts a new day after the night with recovery reduced by sleep debt", () => {
    let s = newGame(1);
    s = advancePhase(advancePhase(advancePhase(s)));
    s.meters.energy = 2;
    s.meters.sleepDebt = 4;
    s = advancePhase(s);
    expect(s.day).toBe(2);
    expect(s.phase).toBe("morning");
    expect(s.meters.energy).toBe(4);
    expect(s.meters.sleepDebt).toBe(2);
  });
});
