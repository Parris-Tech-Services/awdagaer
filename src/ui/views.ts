import { choiceStatus, menu, phaseLabel, q, type StoryletIndex } from "../engine/engine";
import { capitalise } from "../engine/effects";
import { DAILY_ATTENTION, MAX_ENERGY } from "../engine/state";
import type { GameState, Machine, Region, Storylet } from "../engine/types";
import { ATTRIBUTES, TRUST_GROUPS } from "../engine/types";
import { ENDINGS, type EndingId } from "../content/finale";
import { PROJECTS, THREADS, type Project } from "../content/quilt";
import { h } from "./dom";

export type Tab = "story" | "dadlan" | "journal" | "threads" | "quilt";
export type LocationFilter = Region | "all";

export interface UiState {
  tab: Tab;
  location: LocationFilter;
  tutorialHidden: boolean;
  projectQuery: string;
  soundOn: boolean;
}

export interface Actions {
  open(id: string): void;
  back(): void;
  choose(id: string): void;
  advance(): void;
  tab(t: Tab): void;
  location(l: LocationFilter): void;
  hideTutorial(): void;
  toggleSound(): void;
  projectQuery(text: string): void;
  toTitle(): void;
}

export const REGION_LABELS: Record<Region, string> = {
  home: "Home",
  dadlan: "DadLAN",
  rack: "Network Rack",
  workshop: "Workshop",
  chemist: "Chemist",
  hospital: "Dubbo Health",
  datacentre: "Data Centre",
  archive: "Archive",
  neathbound: "NeathBound",
};
const REGION_ORDER: Region[] = ["home", "dadlan", "rack", "workshop", "chemist", "hospital", "datacentre", "archive", "neathbound"];

const NEXT_LABEL = {
  morning: "Head out for the day →",
  day: "Head home for the evening →",
  evening: "Night falls →",
  night: "Go to bed",
} as const;

export function chapterName(s: GameState): string {
  return q(s, "chapter") >= 2 ? "Chapter Two: The Archive" : "Chapter One: Name Resolution";
}

/** Noise is hidden; the player only gets a feeling. */
export function houseFeel(noise: number): string {
  if (noise <= 1) return "The house is quiet. You can hear the fridge.";
  if (noise <= 4) return "The house hums along.";
  if (noise <= 8) return "Everything is slightly too loud.";
  return "Fans, pings, unfinished things. You can't hear yourself think.";
}

function bar(value: number, max: number, warn = false): HTMLElement {
  const span = h("span");
  span.style.width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
  return h("div", { class: warn ? "bar warn" : "bar", role: "presentation" }, span);
}

function meterRow(label: string, value: number, max: number, warn = false): HTMLElement[] {
  return [h("div", { class: "stat" }, h("span", {}, label), h("b", {}, max ? `${value}/${max}` : String(value))), bar(value, max || 50, warn)];
}

export const threadsFound = (s: GameState) => THREADS.filter((_, i) => q(s, `thread:${i + 1}`) > 0).length;

// ── Header ──────────────────────────────────────────────────

export function header(s: GameState, ui: UiState, a: Actions): HTMLElement {
  return h(
    "header",
    { class: "top" },
    h("div", { class: "brand" }, h("small", {}, `The Parris Quilt // ${chapterName(s)}`), h("h1", {}, "SIGNAL BENEATH")),
    h(
      "div",
      { class: "pills" },
      h("span", { class: "pill" }, `Day ${s.day} · ${phaseLabel(s.phase)}`),
      h("button", { class: "pill", "aria-pressed": ui.soundOn ? "true" : "false", onclick: a.toggleSound, title: "Ambient sound follows how loud the house is" }, ui.soundOn ? "Sound on" : "Sound off"),
      h("button", { class: "pill", onclick: a.toTitle }, "Saves & menu"),
    ),
  );
}

// ── Left: locations ─────────────────────────────────────────

function availableByRegion(s: GameState, index: StoryletIndex): Map<Region, number> {
  const counts = new Map<Region, number>();
  if (s.current || s.ended) return counts;
  for (const st of menu(s, index)) counts.set(st.region, (counts.get(st.region) ?? 0) + 1);
  return counts;
}

export function nav(s: GameState, index: StoryletIndex, ui: UiState, a: Actions): HTMLElement {
  const counts = availableByRegion(s, index);
  const btn = (loc: LocationFilter, label: string, n: number) =>
    h(
      "button",
      { "aria-current": ui.location === loc ? "true" : "false", class: n === 0 && loc !== "all" ? "locked" : "", onclick: () => a.location(loc) },
      h("span", {}, label),
      n ? h("span", { class: "count" }, String(n)) : null,
    );
  const total = [...counts.values()].reduce((x, y) => x + y, 0);
  return h(
    "nav",
    { class: "nav panel", "aria-label": "Locations" },
    h("p", { class: "label" }, "Locations"),
    btn("all", "Everywhere", total),
    ...REGION_ORDER.map((r) => btn(r, REGION_LABELS[r], counts.get(r) ?? 0)),
    h("p", { class: "label", style: "margin-top:14px" }, `${phaseLabel(s.phase)} options`),
    h("p", { style: "margin:0;color:var(--muted);font-size:13px" }, s.current ? "Finish the current scene first." : `${total} things are asking for you.`),
  );
}

function mobileLocations(s: GameState, index: StoryletIndex, ui: UiState, a: Actions): HTMLElement {
  const counts = availableByRegion(s, index);
  return h(
    "div",
    { class: "mobile-locs", "aria-label": "Locations" },
    h("button", { class: "pill", "aria-pressed": ui.location === "all" ? "true" : "false", onclick: () => a.location("all") }, "Everywhere"),
    ...REGION_ORDER.filter((r) => counts.get(r)).map((r) =>
      h("button", { class: "pill", "aria-pressed": ui.location === r ? "true" : "false", onclick: () => a.location(r) }, `${REGION_LABELS[r]} ${counts.get(r)}`),
    ),
  );
}

// ── Right: the Keeper ───────────────────────────────────────

export function side(s: GameState): HTMLElement {
  const m = s.meters;
  const recent = [...s.journal].reverse().slice(0, 3);
  return h(
    "aside",
    { class: "side" },
    h(
      "section",
      { class: "panel", "aria-label": "Meters" },
      h("p", { class: "label" }, s.name),
      ...meterRow("Energy", m.energy, MAX_ENERGY, m.energy <= 3),
      ...meterRow("Attention", m.attention, DAILY_ATTENTION, m.attention <= 2),
      ...meterRow("Family connection", m.familyConnection, 0),
      ...meterRow("System stability", m.systemStability, 100, m.systemStability < 35),
      h("div", { class: "stat" }, h("span", {}, "Tech debt"), h("b", {}, String(m.techDebt))),
      h("div", { class: "stat" }, h("span", {}, "Sleep debt"), h("b", {}, String(m.sleepDebt))),
      h("p", { class: "feel" }, houseFeel(m.noise)),
    ),
    h(
      "section",
      { class: "panel", "aria-label": "Attributes and trust" },
      h("p", { class: "label" }, "Attributes"),
      ...ATTRIBUTES.map((x) => h("div", { class: "stat" }, h("span", {}, capitalise(x)), h("b", {}, String(s.attributes[x])))),
      h("p", { class: "label", style: "margin-top:12px" }, "Trust"),
      ...TRUST_GROUPS.map((g) => h("div", { class: "stat" }, h("span", {}, g === "ai" ? "AI systems" : capitalise(g)), h("b", {}, String(s.trust[g])))),
    ),
    h(
      "section",
      { class: "panel", "aria-label": "Evidence" },
      h("p", { class: "label" }, `Threads ${threadsFound(s)}/50 · Evidence`),
      ...(recent.length ? recent.map((j) => h("div", { class: "clue" }, j.text)) : [h("div", { class: "clue" }, "No verified anomalies yet.")]),
    ),
  );
}

// ── Story ───────────────────────────────────────────────────

function tutorial(a: Actions): HTMLElement {
  return h(
    "section",
    { class: "panel tutorial", "aria-label": "How to play" },
    h("p", { class: "label" }, "How to play"),
    h(
      "ol",
      {},
      h("li", {}, "Each day has four phases: Morning, Day, Evening, Night. Pick things to do from the cards, then move on when you're ready."),
      h("li", {}, "Choices may cost Attention (resets each morning) or Energy (restored by sleep). Anything after dark adds sleep debt, more each time."),
      h("li", {}, "Skill checks show your exact chance of success. Low Energy makes everything harder."),
      h("li", {}, "Shortcuts add Tech Debt, and it comes back. Family time works best when it isn't the same thing every night."),
      h("li", {}, "Your Journal marks how sure you are of each fact. Remembering isn't verifying."),
    ),
    h("div", { class: "row" }, h("button", { class: "secondary", onclick: a.hideTutorial }, "Got it")),
  );
}

function outcomePanel(s: GameState): HTMLElement | null {
  const o = s.lastOutcome;
  if (!o) return null;
  const failed = o.check && !o.check.success;
  if (!o.text && !o.check && !o.changes.length) return null;
  return h(
    "section",
    { class: `panel outcome${failed ? " fail" : ""}`, "aria-live": "polite" },
    o.check
      ? h(
          "div",
          { class: "roll" },
          `${capitalise(o.check.attribute)} ${o.check.difficulty} · ${o.check.chance}% · rolled ${o.check.roll} — `,
          h("b", {}, o.check.success ? "SUCCESS" : "FAILURE"),
        )
      : null,
    o.text ? h("div", { class: "prose" }, o.text) : null,
    o.changes.length ? h("ul", { class: "changes" }, ...o.changes.map((c) => h("li", {}, c))) : null,
  );
}

function sceneView(s: GameState, st: Storylet, a: Actions): HTMLElement {
  const text = typeof st.text === "function" ? st.text(s) : st.text;
  const choices = st.choices
    .map((c) => ({ c, status: choiceStatus(s, c) }))
    .filter(({ status }) => status.visible)
    .map(({ c, status }) => {
      const meta: (HTMLElement | string)[] = [];
      if (c.check && status.chance !== undefined)
        meta.push(h("span", { class: "odds" }, `${capitalise(c.check.attribute)} ${status.difficulty} · ${status.chance}% chance`));
      if (c.attention) meta.push(`Attention −${c.attention}`);
      if (c.energy) meta.push(`Energy −${c.energy}`);
      if (s.phase === "night") meta.push(`Sleep debt +${s.nightActions + 1}`);
      if (status.reason) meta.push(h("span", { class: "why" }, status.reason));
      const metaEl = meta.length ? h("span", { class: "meta" }) : null;
      meta.forEach((m, i) => metaEl?.append(...(i ? [" · ", m] : [m])));
      return h(
        "button",
        { class: "choice", disabled: !status.enabled, onclick: () => a.choose(c.id) },
        h("span", { class: "title" }, c.label),
        c.hint ? h("span", { class: "hint" }, c.hint) : null,
        metaEl,
      );
    });
  return h(
    "section",
    { class: "panel scene" },
    h("div", { class: "tag" }, `Day ${s.day} · ${REGION_LABELS[st.region]}`),
    h("h2", {}, st.title),
    h("div", { class: "prose" }, text),
    h("div", { class: "choices" }, ...choices),
    st.sceneOnly ? null : h("div", { class: "row" }, h("button", { class: "secondary", onclick: a.back }, "← Not yet")),
  );
}

function menuView(s: GameState, index: StoryletIndex, ui: UiState, a: Actions): HTMLElement {
  const all = menu(s, index);
  const items = ui.location === "all" ? all : all.filter((st) => st.region === ui.location);
  return h(
    "section",
    { class: "panel scene" },
    h("div", { class: "tag" }, `Day ${s.day} · ${phaseLabel(s.phase)}${ui.location === "all" ? "" : ` · ${REGION_LABELS[ui.location]}`}`),
    h("h2", {}, ui.location === "all" ? "What needs you?" : REGION_LABELS[ui.location]),
    items.length
      ? h(
          "div",
          { class: "menu" },
          ...items.map((st) =>
            h(
              "button",
              { class: (st.priority ?? 0) >= 50 ? "card urgent" : "card", onclick: () => a.open(st.id) },
              h("span", { class: "where" }, (st.priority ?? 0) >= 50 ? `Urgent · ${REGION_LABELS[st.region]}` : REGION_LABELS[st.region]),
              h("span", { class: "name" }, st.title),
            ),
          ),
        )
      : h("p", { class: "prose" }, ui.location === "all" ? "Nothing is asking for you right now. That's allowed." : "Nothing here right now."),
    h("div", { class: "row" }, h("button", { class: "primary", onclick: a.advance }, NEXT_LABEL[s.phase])),
  );
}

const ENDING_IDS = Object.keys(ENDINGS) as EndingId[];

function endingView(s: GameState, a: Actions): HTMLElement {
  const ending = ENDING_IDS.find((e) => q(s, `ending:${e}`) > 0);
  const lessons = [
    ["lesson:visible-failure", "The visible failure is not the originating failure."],
    ["lesson:labels", "Labels are not evidence."],
    ["lesson:persistence", "A fix isn't finished until it persists, or is honestly labelled temporary."],
    ["lesson:change-control", "Change control: test, verify, roll back, deploy gradually."],
    ["lesson:consistency", "The interface must match what the system actually does."],
    ["lesson:visual-verification", "Passing tests is not the same as working correctly."],
  ].filter(([k]) => q(s, k!) > 0);
  const contaminated = q(s, "archive:contaminated");
  const epilogue = [
    s.meters.familyConnection >= 30 ? "The house remembers this week as a good one." : "The house remembers this week as one where you were mostly in the cupboard.",
    s.meters.techDebt >= 4 ? "Several workarounds are still holding things up. They'll be back." : "Most of what you fixed stays fixed.",
    contaminated ? `Your Archive still holds ${contaminated} record(s) filed wrongly. Whatever you kept, you kept those mistakes too.` : "Every record you filed says what you actually know.",
  ];
  return h(
    "section",
    { class: "panel scene" },
    h("div", { class: "tag" }, "End of Act One"),
    h("h2", {}, ending ? "Ending unlocked" : "The end, for now"),
    ending ? h("p", { class: "ending-name" }, ENDINGS[ending]) : null,
    h("div", { class: "prose" }, epilogue.join("\n\n")),
    h(
      "p",
      { class: "label", style: "margin-top:16px" },
      `Day ${s.day} · Threads ${threadsFound(s)}/50 · Discernment ${s.attributes.discernment} · Family ${s.meters.familyConnection} · Stability ${s.meters.systemStability}`,
    ),
    lessons.length ? h("ul", {}, ...lessons.map(([, t]) => h("li", {}, t!))) : null,
    h("div", { class: "row" }, h("button", { class: "primary", onclick: a.toTitle }, "Back to saves"), h("button", { class: "secondary", onclick: () => a.tab("threads") }, "See the threads you found")),
  );
}

function storyTab(s: GameState, index: StoryletIndex, ui: UiState, a: Actions): HTMLElement[] {
  const parts: (HTMLElement | null)[] = [];
  if (!ui.tutorialHidden && s.day === 1) parts.push(tutorial(a));
  parts.push(outcomePanel(s));
  if (s.ended) parts.push(endingView(s, a));
  else {
    const current = s.current ? index.get(s.current) : undefined;
    if (!current) parts.push(mobileLocations(s, index, ui, a));
    parts.push(current ? sceneView(s, current, a) : menuView(s, index, ui, a));
  }
  return parts.filter((x): x is HTMLElement => x !== null);
}

// ── Other tabs ──────────────────────────────────────────────

export function networkDiagram(s: GameState): string {
  const nodes = Object.values(s.machines).filter((m) => !m.retired && m.port === "DadLAN core");
  const lines = nodes.map((m) => `${m.name.toUpperCase()}${q(s, "lancache:built") && m.id === "thinkpad" ? " (cache node)" : ""}`);
  if (q(s, "clue:unknown-device") || q(s, "beneath") >= 2)
    lines.push(q(s, "clue:neath-origin") ? "NEATH  (2009 resolver, council–hospital link)" : "NEATH ??");
  const switchName = ["", "QUIET 100M SWITCH", "D-LINK GIGABIT", "", "PROCURVE"][q(s, "rack:switch")] || "DADLAN CORE";
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
    h("b", {}, m.name),
    h("div", { style: "color:var(--muted);font-size:14px" }, `${m.role} · ${m.os} · ${m.storage} · reliability ${m.reliability} · ${m.port}`),
    h("div", { class: "chips" }, ...m.traits.map((t) => h("span", { class: "chip" }, t))),
  );
}

function dadlanTab(s: GameState): HTMLElement[] {
  return [
    h("section", { class: "panel" }, h("p", { class: "label" }, "Network"), h("pre", { class: "diagram" }, networkDiagram(s))),
    h("section", { class: "panel" }, h("p", { class: "label" }, "Machines"), ...Object.values(s.machines).map(machineView)),
  ];
}

function journalTab(s: GameState): HTMLElement[] {
  return [
    h(
      "section",
      { class: "panel" },
      h("p", { class: "label" }, "Journal"),
      h("p", { class: "feel" }, "Remembering is not verifying. Every entry carries how sure you actually are."),
      s.journal.length
        ? h(
            "ul",
            { class: "journal" },
            ...[...s.journal].reverse().map((j) =>
              h("li", {}, j.status ? h("span", { class: `status ${j.status}` }, j.status.replace("-", " ")) : null, h("span", { class: "day" }, `Day ${j.day}`), h("div", { class: "prose", style: "font-size:16px" }, j.text)),
            ),
          )
        : h("p", {}, "Nothing written down yet."),
    ),
  ];
}

function threadsTab(s: GameState): HTMLElement[] {
  return [
    h(
      "section",
      { class: "panel" },
      h("p", { class: "label" }, `The 50 threads · ${threadsFound(s)} found`),
      h("p", { class: "feel" }, "Fifty conversations, stitched into one story. Each one you live through shows its lesson here."),
      h(
        "div",
        { class: "threads" },
        ...THREADS.map(([title, lesson], i) =>
          q(s, `thread:${i + 1}`) > 0
            ? h("div", { class: "thread" }, h("b", {}, `${String(i + 1).padStart(2, "0")} · ${title}`), h("span", {}, lesson))
            : h("div", { class: "thread unknown" }, h("b", {}, `${String(i + 1).padStart(2, "0")} · ???`), h("span", {}, "Not yet lived.")),
        ),
      ),
    ),
  ];
}

const TYPE_LABEL: Record<Project["type"], string> = { game: "PLAYABLE WORLD", app: "APP NODE", tool: "TOOL NODE", archive: "ARCHIVE NODE", hub: "HUB NODE" };

function projectCard(p: Project): HTMLElement {
  return h(
    "article",
    { class: p.featured ? "project feature" : "project", "data-search": `${p.name} ${p.type} ${p.desc ?? ""}`.toLowerCase() },
    h("div", { class: "type" }, TYPE_LABEL[p.type]),
    h("h3", {}, p.name),
    p.desc ? h("p", {}, p.desc) : null,
    h(
      "div",
      { class: "links" },
      p.play ? h("a", { href: p.play, target: "_blank", rel: "noopener" }, "Enter world ↗") : null,
      h("a", { href: p.repo, target: "_blank", rel: "noopener" }, "Source ↗"),
    ),
  );
}

function quiltTab(ui: UiState, a: Actions): HTMLElement[] {
  const query = ui.projectQuery.trim().toLowerCase();
  const visible = PROJECTS.filter((p) => !query || `${p.name} ${p.type} ${p.desc ?? ""}`.toLowerCase().includes(query));
  const input = h("input", { class: "search", type: "search", placeholder: "Search the Quilt…", "aria-label": "Search projects", value: ui.projectQuery });
  input.addEventListener("input", () => a.projectQuery(input.value));
  return [
    h(
      "section",
      { class: "panel" },
      h("p", { class: "label" }, `Project Quilt · ${PROJECTS.length} nodes`),
      h("p", { class: "feel" }, "Every world, tool and archive the Keeper keeps alive. The Beneath can see all of them."),
      input,
      h("div", { class: "projects" }, ...visible.map(projectCard)),
      visible.length ? null : h("p", {}, "No nodes match."),
    ),
  ];
}

export function tabsBar(s: GameState, ui: UiState, a: Actions): HTMLElement {
  const b = (t: Tab, label: string) => h("button", { "aria-pressed": ui.tab === t ? "true" : "false", onclick: () => a.tab(t) }, label);
  return h(
    "div",
    { class: "tabs panel", role: "toolbar", "aria-label": "Views" },
    b("story", "Story"),
    b("dadlan", "DadLAN"),
    b("journal", `Journal (${s.journal.length})`),
    b("threads", `Threads ${threadsFound(s)}/50`),
    b("quilt", "Project Quilt"),
  );
}

export function body(s: GameState, index: StoryletIndex, ui: UiState, a: Actions): HTMLElement[] {
  switch (ui.tab) {
    case "story":
      return storyTab(s, index, ui, a);
    case "dadlan":
      return dadlanTab(s);
    case "journal":
      return journalTab(s);
    case "threads":
      return threadsTab(s);
    case "quilt":
      return quiltTab(ui, a);
  }
}
