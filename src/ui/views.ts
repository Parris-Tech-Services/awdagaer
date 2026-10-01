import { choiceStatus, menu, phaseLabel, q, type StoryletIndex } from "../engine/engine";
import { capitalise } from "../engine/effects";
import { DAILY_ATTENTION, MAX_ENERGY } from "../engine/state";
import type { GameState, Machine, Storylet } from "../engine/types";
import { ATTRIBUTES, TRUST_GROUPS } from "../engine/types";
import { h } from "./dom";

export interface Actions {
  open(id: string): void;
  back(): void;
  choose(id: string): void;
  advance(): void;
  tab(t: Tab): void;
  newGame(): void;
}
export type Tab = "story" | "dadlan" | "journal";

const REGION_LABELS: Record<Storylet["region"], string> = {
  home: "Home",
  dadlan: "The DadLAN",
  rack: "The Network Rack",
  workshop: "The Workshop",
  chemist: "The Chemist",
  hospital: "Dubbo Health",
  datacentre: "The Data Centre",
  archive: "The Archive",
  neathbound: "NeathBound",
};

const NEXT_LABEL = {
  morning: "Head out for the day →",
  day: "Head home for the evening →",
  evening: "Night falls →",
  night: "Go to bed",
} as const;

function bar(value: number, max: number, warn = false): HTMLElement {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const span = h("span");
  span.style.width = `${pct}%`;
  return h("div", { class: warn ? "bar warn" : "bar", role: "presentation" }, span);
}

/** Noise is hidden; the player only gets a feeling. */
export function houseFeel(noise: number): string {
  if (noise <= 1) return "The house is quiet. You can hear the fridge.";
  if (noise <= 4) return "The house hums along.";
  if (noise <= 8) return "Everything is slightly too loud.";
  return "Fans, pings, unfinished things. You can't hear yourself think.";
}

export function sidebar(s: GameState): HTMLElement {
  const m = s.meters;
  return h(
    "aside",
    { class: "sidebar" },
    h(
      "section",
      { class: "panel", "aria-label": "Meters" },
      h("h2", {}, s.name),
      h("div", { class: "stat" }, h("span", {}, "Energy"), h("span", {}, `${m.energy}/${MAX_ENERGY}`)),
      bar(m.energy, MAX_ENERGY, m.energy <= 3),
      h("div", { class: "stat" }, h("span", {}, "Attention"), h("span", {}, `${m.attention}/${DAILY_ATTENTION}`)),
      bar(m.attention, DAILY_ATTENTION, m.attention <= 2),
      h("div", { class: "stat" }, h("span", {}, "Family Connection"), h("span", {}, String(m.familyConnection))),
      bar(m.familyConnection, 50),
      h("div", { class: "stat" }, h("span", {}, "System Stability"), h("span", {}, String(m.systemStability))),
      bar(m.systemStability, 100, m.systemStability < 35),
      h("div", { class: "stat" }, h("span", {}, "Tech Debt"), h("span", {}, String(m.techDebt))),
      h("div", { class: "stat" }, h("span", {}, "Sleep debt"), h("span", {}, String(m.sleepDebt))),
      h("p", { class: "feel" }, houseFeel(m.noise)),
    ),
    h(
      "section",
      { class: "panel", "aria-label": "Attributes" },
      h("h2", {}, "Attributes"),
      ...ATTRIBUTES.map((a) => h("div", { class: "stat" }, h("span", {}, capitalise(a)), h("span", {}, String(s.attributes[a])))),
    ),
    h(
      "section",
      { class: "panel", "aria-label": "Trust" },
      h("h2", {}, "Trust"),
      ...TRUST_GROUPS.map((g) =>
        h("div", { class: "stat" }, h("span", {}, g === "ai" ? "AI systems" : capitalise(g)), h("span", {}, String(s.trust[g]))),
      ),
    ),
  );
}

function outcomePanel(s: GameState): HTMLElement | null {
  const o = s.lastOutcome;
  if (!o) return null;
  const failed = o.check && !o.check.success;
  return h(
    "section",
    { class: `panel outcome${failed ? " fail" : ""}`, "aria-live": "polite" },
    o.check
      ? h(
          "div",
          { class: "roll" },
          `${capitalise(o.check.attribute)} vs ${o.check.difficulty} · ${o.check.chance}% · rolled ${o.check.roll} — ${
            o.check.success ? "SUCCESS" : "FAILURE"
          }`,
        )
      : null,
    h("div", { class: "prose" }, o.text),
    o.changes.length ? h("ul", { class: "changes" }, ...o.changes.map((c) => h("li", {}, c))) : null,
  );
}

function storyletView(s: GameState, st: Storylet, a: Actions): HTMLElement {
  const text = typeof st.text === "function" ? st.text(s) : st.text;
  const choices = st.choices
    .map((c) => ({ c, status: choiceStatus(s, c) }))
    .filter(({ status }) => status.visible)
    .map(({ c, status }) => {
      const meta = [
        c.check && status.chance !== undefined
          ? `${capitalise(c.check.attribute)} ${status.difficulty} · ${status.chance}% chance`
          : null,
        c.attention ? `Attention −${c.attention}` : null,
        c.energy ? `Energy −${c.energy}` : null,
        s.phase === "night" ? `Sleep debt +${s.nightActions + 1}` : null,
        status.reason ?? null,
      ].filter(Boolean);
      return h(
        "button",
        { class: "choice", disabled: !status.enabled, onclick: () => a.choose(c.id) },
        h("span", { class: "label" }, c.label),
        c.hint ? h("span", { class: "hint" }, c.hint) : null,
        meta.length ? h("span", { class: "meta" }, meta.join(" · ")) : null,
      );
    });
  return h(
    "section",
    { class: "panel story" },
    h("div", { class: "region" }, REGION_LABELS[st.region]),
    h("h2", {}, st.title),
    h("div", { class: "prose" }, text),
    h("div", { class: "choices" }, ...choices),
    st.sceneOnly ? null : h("div", { class: "row" }, h("button", { class: "secondary", onclick: a.back }, "← Not yet")),
  );
}

function menuView(s: GameState, index: StoryletIndex, a: Actions): HTMLElement {
  const items = menu(s, index);
  return h(
    "section",
    { class: "panel" },
    h("h2", {}, `${phaseLabel(s.phase)}, day ${s.day}`),
    items.length
      ? h(
          "div",
          { class: "menu" },
          ...items.map((st) =>
            h(
              "button",
              { class: "card", onclick: () => a.open(st.id) },
              h("span", { class: "region" }, REGION_LABELS[st.region]),
              h("span", { class: "title" }, st.title),
            ),
          ),
        )
      : h("p", {}, "Nothing is asking for you right now. That's allowed."),
    h("div", { class: "row" }, h("button", { class: "primary", onclick: a.advance }, NEXT_LABEL[s.phase])),
  );
}

export function storyTab(s: GameState, index: StoryletIndex, a: Actions): HTMLElement[] {
  if (s.ended) return [outcomePanel(s), endingView(s, a)].filter((x): x is HTMLElement => x !== null);
  const current = s.current ? index.get(s.current) : undefined;
  return [outcomePanel(s), current ? storyletView(s, current, a) : menuView(s, index, a)].filter(
    (x): x is HTMLElement => x !== null,
  );
}

function endingView(s: GameState, a: Actions): HTMLElement {
  const lessons = [
    ["lesson:visible-failure", "The visible failure is not the originating failure."],
    ["lesson:labels", "Labels are not evidence."],
    ["lesson:persistence", "A fix isn't finished until it persists — or is honestly labelled temporary."],
    ["lesson:change-control", "Change control: test, verify, roll back, deploy gradually."],
    ["lesson:consistency", "The interface must match what the system actually does."],
  ].filter(([k]) => q(s, k!) > 0);
  return h(
    "section",
    { class: "panel story" },
    h("div", { class: "region" }, "End of Chapter One"),
    h("h2", {}, "Name Resolution"),
    h(
      "p",
      { class: "prose" },
      `Days kept: ${s.day}. Family Connection ${s.meters.familyConnection}. System Stability ${s.meters.systemStability}. Tech Debt ${s.meters.techDebt}. Discernment ${s.attributes.discernment}.`,
    ),
    lessons.length
      ? h("ul", {}, ...lessons.map(([, t]) => h("li", {}, t!)))
      : h("p", {}, "You kept things running. You aren't yet sure what you learned."),
    h("p", { class: "feel" }, "Chapter Two — The Archive — is still being written."),
    h("div", { class: "row" }, h("button", { class: "primary", onclick: a.newGame }, "Start again")),
  );
}

export function networkDiagram(s: GameState): string {
  const nodes = Object.values(s.machines).filter((m) => !m.retired && m.port === "DadLAN core");
  const lines = nodes.map((m) => `${m.name.toUpperCase()}${q(s, "lancache:built") && m.id === "thinkpad" ? " (cache node)" : ""}`);
  if (q(s, "clue:unknown-device") || q(s, "beneath") >= 2) lines.push("NEATH ??");
  const switchName = ["", "QUIET 100M", "D-LINK GIGABIT", "", "PROCURVE"][q(s, "rack:switch")] || "DADLAN CORE";
  return [
    "INTERNET",
    "│",
    `ROUTER${q(s, "lancache:live") ? "  (DNS → cache node → upstream)" : ""}`,
    "│",
    switchName,
    ...lines.map((l, i) => `${i === lines.length - 1 ? "└──" : "├──"} ${l}`),
  ].join("\n");
}

function machineView(m: Machine): HTMLElement {
  return h(
    "div",
    { class: "machine" },
    h("strong", {}, m.name),
    h("div", { class: "region" }, `${m.role} · ${m.os} · ${m.storage} · reliability ${m.reliability} · ${m.port}`),
    h("div", { class: "traits" }, ...m.traits.map((t) => h("span", { class: "trait" }, t))),
  );
}

export function dadlanTab(s: GameState): HTMLElement[] {
  return [
    h("section", { class: "panel" }, h("h2", {}, "Network"), h("pre", { class: "diagram" }, networkDiagram(s))),
    h("section", { class: "panel" }, h("h2", {}, "Machines"), ...Object.values(s.machines).map(machineView)),
  ];
}

export function journalTab(s: GameState): HTMLElement[] {
  if (!s.journal.length) return [h("section", { class: "panel" }, h("h2", {}, "Journal"), h("p", {}, "Nothing written down yet."))];
  return [
    h(
      "section",
      { class: "panel journal" },
      h("h2", {}, "Journal"),
      h("p", { class: "feel" }, "Remembering is not verifying. Every entry carries how sure you actually are."),
      h(
        "ul",
        {},
        ...[...s.journal].reverse().map((j) =>
          h(
            "li",
            {},
            j.status ? h("span", { class: `status ${j.status}` }, j.status.replace("-", " ")) : null,
            h("span", { class: "region" }, ` Day ${j.day} `),
            h("div", { class: "prose" }, j.text),
          ),
        ),
      ),
    ),
  ];
}

