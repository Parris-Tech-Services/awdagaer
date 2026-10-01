import { describe, expect, it } from "vitest";
import { ALL_STORYLETS, STORYLETS } from "../src/content";
import { advancePhase, choiceStatus, choose, menu, openStorylet, q } from "../src/engine/engine";
import { nextRandom } from "../src/engine/rng";
import { newGame } from "../src/engine/state";
import type { GameState } from "../src/engine/types";

describe("content integrity", () => {
  it("every `next` points at a real storylet", () => {
    for (const st of ALL_STORYLETS)
      for (const c of st.choices)
        for (const o of [c.success, c.failure])
          if (o?.next) expect(STORYLETS.has(o.next), `${st.id}.${c.id} → ${o.next}`).toBe(true);
  });

  it("every check has a failure outcome", () => {
    for (const st of ALL_STORYLETS)
      for (const c of st.choices) if (c.check) expect(c.failure, `${st.id}.${c.id}`).toBeDefined();
  });

  it("every scene-only storylet is reachable", () => {
    const targets = new Set(ALL_STORYLETS.flatMap((st) => st.choices.flatMap((c) => [c.success.next, c.failure?.next])));
    for (const st of ALL_STORYLETS.filter((x) => x.sceneOnly)) expect(targets.has(st.id), st.id).toBe(true);
  });

  it("every scene-only storylet always offers a free way forward", () => {
    // A player with no Attention or Energy left must never be trapped mid-scene.
    const broke = newGame(1);
    broke.meters.attention = 0;
    broke.meters.energy = 0;
    for (const st of ALL_STORYLETS.filter((x) => x.sceneOnly)) {
      const open = st.choices.filter((c) => choiceStatus(broke, c).enabled);
      expect(open.length, st.id).toBeGreaterThan(0);
    }
  });
});

/** Plays the whole chapter with random choices, the way a careless player might. */
function randomPlaythrough(seed: number): GameState {
  let s = newGame(seed);
  let rng = seed ^ 0x5eed;
  const pick = (n: number) => {
    const r = nextRandom(rng);
    rng = r.state;
    return Math.floor(r.value * n);
  };
  for (let step = 0; step < 400 && !s.ended; step++) {
    if (s.current) {
      const st = STORYLETS.get(s.current)!;
      const open = st.choices.filter((c) => choiceStatus(s, c).enabled);
      expect(open.length, `stuck in ${st.id} on day ${s.day}`).toBeGreaterThan(0);
      s = choose(s, STORYLETS, open[pick(open.length)]!.id);
      continue;
    }
    const items = menu(s, STORYLETS);
    if (items.length && pick(3) > 0) {
      const st = items[pick(items.length)]!;
      const open = st.choices.filter((c) => choiceStatus(s, c).enabled);
      if (open.length) {
        s = openStorylet(s, STORYLETS, st.id);
        continue;
      }
    }
    s = advancePhase(s);
  }
  return s;
}

describe("playthrough", () => {
  it("reaches the end of Chapter One from many seeds without errors", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const s = randomPlaythrough(seed);
      expect(s.ended, `seed ${seed} did not finish`).toBe(true);
      expect(s.day).toBeGreaterThanOrEqual(3);
    }
  });

  it("deploying the cache without testing breaks the house the next morning", () => {
    let s = newGame(7);
    s.qualities["lancache:built"] = 1;
    s = advancePhase(advancePhase(advancePhase(s))); // night
    s = choose(openStorylet(s, STORYLETS, "lancache-deploy"), STORYLETS, "now");
    s = advancePhase(s); // sleep → day 2 morning
    const first = menu(s, STORYLETS)[0];
    expect(first?.id).toBe("lancache-incident");
    s = choose(openStorylet(s, STORYLETS, "lancache-incident"), STORYLETS, "rollback");
    expect(q(s, "lesson:change-control")).toBe(1);
    expect(s.journal.some((j) => j.text.startsWith("SAFE DEPLOYMENT"))).toBe(true);
    expect(s.phase).toBe("day");
  });

  it("the Google ticket can be reasoned to DNS without a lucky roll", () => {
    let s = newGame(3);
    s = advancePhase(s); // day
    s = choose(openStorylet(s, STORYLETS, "ticket-google"), STORYLETS, "reinstall");
    s = choose(s, STORYLETS, "network");
    expect(s.current).toBe("ticket-google-layer");
    s = choose(s, STORYLETS, "dns-reasoned");
    expect(s.current).toBe("ticket-google-fix");
    s = choose(s, STORYLETS, "clean");
    expect(q(s, "lesson:visible-failure")).toBe(1);
  });
});
