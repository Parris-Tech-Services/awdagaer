import { describe, expect, it } from "vitest";
import { STORYLETS } from "../src/content";
import { FINALE_REQUIREMENTS } from "../src/content/finale";
import { advancePhase, choiceStatus, choose, menu, openStorylet, q } from "../src/engine/engine";
import { newGame } from "../src/engine/state";
import type { GameState } from "../src/engine/types";

function chapterTwo(day = 4): GameState {
  const s = newGame(11);
  s.day = day;
  s.phase = "day";
  s.qualities.chapter = 2;
  return s;
}

describe("the Archive", () => {
  it("classifying a record correctly raises integrity and journals the chosen status", () => {
    let s = chapterTwo();
    s = openStorylet(s, STORYLETS, "archive-terminal");
    s = choose(s, STORYLETS, "name");
    expect(s.current).toBe("record-jparris-perth");
    s = choose(s, STORYLETS, "false-attribution");
    expect(q(s, "archive:integrity")).toBe(1);
    expect(q(s, "thread:33")).toBe(1);
    expect(s.journal.at(-1)?.status).toBe("false-attribution");
  });

  it("a wrong classification contaminates the Archive and locks folder 2004 until reviewed", () => {
    let s = chapterTwo();
    s.qualities["archive:depth"] = 3;
    s.qualities["archive:integrity"] = 3;
    s = choose(openStorylet(s, STORYLETS, "archive-terminal"), STORYLETS, "name");
    s = choose(s, STORYLETS, "confirmed"); // it was someone else's email
    expect(q(s, "archive:contaminated")).toBe(1);
    s = choose(openStorylet(s, STORYLETS, "archive-terminal"), STORYLETS, "folder");
    const read = STORYLETS.get("folder-2004")!.choices.find((c) => c.id === "read")!;
    expect(choiceStatus(s, read).visible).toBe(false);
  });

  it("a careful player opens folder 2004 and unlocks the finale that night", () => {
    let s = chapterTwo(5);
    s.qualities["archive:depth"] = 3;
    s.qualities["archive:integrity"] = 3;
    s = choose(openStorylet(s, STORYLETS, "archive-terminal"), STORYLETS, "folder");
    s = choose(s, STORYLETS, "read");
    expect(q(s, "archive:2004-opened")).toBe(1);
    expect(q(s, "thread:36")).toBe(1);
    s = advancePhase(advancePhase(s)); // evening → night
    expect(menu(s, STORYLETS)[0]?.id).toBe("finale");
  });

  it("the lost chat cannot be concluded on a single source", () => {
    let s = chapterTwo();
    s = choose(openStorylet(s, STORYLETS, "archive-terminal"), STORYLETS, "phrase-chat");
    s = choose(s, STORYLETS, "commits");
    const conclude = STORYLETS.get("lost-chat")!.choices.find((c) => c.id === "conclude")!;
    expect(choiceStatus(s, conclude).enabled).toBe(false);
    s = choose(s, STORYLETS, "build");
    expect(choiceStatus(s, conclude).enabled).toBe(true);
  });
});

describe("consequences", () => {
  it("a hard-coded DNS shortcut brings Marg back in Chapter Two", () => {
    const s = chapterTwo();
    expect(menu(s, STORYLETS).some((st) => st.id === "marg-again")).toBe(false);
    s.qualities["debt:marg-dns"] = 1;
    expect(menu(s, STORYLETS).some((st) => st.id === "marg-again")).toBe(true);
  });

  it("low System Stability causes a morning outage, at most once a day", () => {
    let s = newGame(2);
    s.day = 2;
    s.meters.systemStability = 20;
    expect(menu(s, STORYLETS)[0]?.id).toBe("stability-outage");
    s = choose(openStorylet(s, STORYLETS, "stability-outage"), STORYLETS, "phones");
    s.phase = "morning";
    expect(menu(s, STORYLETS).some((st) => st.id === "stability-outage")).toBe(false);
  });

  it("an unlabelled Steam workaround can't be fixed from notes later", () => {
    const s = chapterTwo(3);
    s.phase = "evening";
    s.qualities["steam:workaround"] = 1;
    const notes = STORYLETS.get("steam-returns")!.choices.find((c) => c.id === "notes")!;
    expect(choiceStatus(s, notes).enabled).toBe(false);
    s.qualities["lesson:persistence"] = 1;
    expect(choiceStatus(s, notes).enabled).toBe(true);
  });

  it("endings depend on how you played", () => {
    const s = chapterTwo(7);
    expect(FINALE_REQUIREMENTS.local(s)).toBe(false);
    expect(FINALE_REQUIREMENTS.federate(s)).toBe(false);
    s.meters.familyConnection = 30;
    s.attributes.discernment = 16;
    s.qualities["lesson:change-control"] = 1;
    expect(FINALE_REQUIREMENTS.local(s)).toBe(true);
    expect(FINALE_REQUIREMENTS.federate(s)).toBe(true);
  });
});
