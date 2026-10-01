import "./style.css";
import { advancePhase, choose, closeStorylet, openStorylet, phaseLabel, q } from "../engine/engine";
import { clearSlot, lastSlot, loadSlot, saveSlot, SLOTS, type Slot } from "../engine/save";
import { newGame } from "../engine/state";
import type { GameState } from "../engine/types";
import { STORYLETS } from "../content";
import { h } from "./dom";
import { setAmbience } from "./sound";
import { body, chapterName, header, nav, side, tabsBar, threadsFound, type Actions, type UiState } from "./views";

const PREFS_KEY = "signal-beneath:prefs";

function loadPrefs(): Pick<UiState, "tutorialHidden" | "soundOn"> {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") as Partial<UiState>;
    return { tutorialHidden: !!p.tutorialHidden, soundOn: false };
  } catch {
    return { tutorialHidden: false, soundOn: false };
  }
}
function savePrefs(): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ tutorialHidden: ui.tutorialHidden }));
  } catch {
    // Preferences are a convenience; ignore storage failures.
  }
}

const root = document.getElementById("app")!;
let slot: Slot | null = null;
let state: GameState | null = null;
const ui: UiState = { tab: "story", location: "all", projectQuery: "", ...loadPrefs() };

function ambience(): void {
  setAmbience(ui.soundOn && !!state, state?.meters.noise ?? 0, state ? q(state, "rack:switch") : 0);
}

function update(next: GameState): void {
  const phaseChanged = !state || next.phase !== state.phase || next.day !== state.day;
  state = next;
  if (slot) saveSlot(slot, next);
  if (phaseChanged) ui.location = "all";
  render();
  window.scrollTo({ top: 0 });
}

const actions: Actions = {
  open: (id) => state && update(openStorylet(state, STORYLETS, id)),
  back: () => state && update(closeStorylet(state, STORYLETS)),
  choose: (id) => state && update(choose(state, STORYLETS, id)),
  advance: () => state && update(advancePhase(state)),
  tab: (t) => {
    ui.tab = t;
    render();
  },
  location: (l) => {
    ui.location = l;
    ui.tab = "story";
    render();
  },
  hideTutorial: () => {
    ui.tutorialHidden = true;
    savePrefs();
    render();
  },
  toggleSound: () => {
    ui.soundOn = !ui.soundOn;
    render();
  },
  projectQuery: (text) => {
    ui.projectQuery = text;
    // Re-render only the results so the search box keeps focus.
    const focused = document.activeElement === document.querySelector(".search");
    render();
    if (focused) {
      const input = document.querySelector<HTMLInputElement>(".search");
      input?.focus();
      input?.setSelectionRange(text.length, text.length);
    }
  },
  toTitle: () => {
    state = null;
    slot = null;
    render();
  },
};

function slotSummary(s: GameState): string {
  if (s.ended) return `${s.name} · Act One complete · ${threadsFound(s)}/50 threads`;
  return `${s.name} · ${chapterName(s)} · Day ${s.day}, ${phaseLabel(s.phase)} · ${threadsFound(s)}/50 threads`;
}

function titleScreen(): HTMLElement {
  const nameInput = h("input", { class: "name-input", "aria-label": "Your name", value: "The Keeper", maxlength: "32" });
  const begin = (n: Slot) => {
    const seed = (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) | 0;
    slot = n;
    ui.tab = "story";
    update(newGame(seed, nameInput.value.trim() || "The Keeper"));
  };
  const resume = (n: Slot) => {
    const s = loadSlot(n);
    if (!s) return;
    slot = n;
    ui.tab = "story";
    update(s);
  };
  const recent = lastSlot();
  const rows = SLOTS.map((n) => {
    const s = loadSlot(n);
    return h(
      "div",
      { class: "panel slot" },
      h("div", { class: "info" }, h("b", {}, `Save slot ${n}${recent === n ? " · most recent" : ""}`), h("span", {}, s ? slotSummary(s) : "Empty")),
      h(
        "div",
        { class: "row", style: "margin:0" },
        s ? h("button", { class: "primary", onclick: () => resume(n) }, "Continue") : null,
        h(
          "button",
          {
            class: s ? "secondary" : "primary",
            onclick: () => {
              if (!s || confirm(`Start a new game in slot ${n}? The save there will be replaced.`)) {
                clearSlot(n);
                begin(n);
              }
            },
          },
          s ? "New game here" : "New game",
        ),
      ),
    );
  });
  return h(
    "div",
    { class: "title-screen" },
    h("h1", {}, "SIGNAL BENEATH"),
    h(
      "p",
      { class: "lede" },
      "Dubbo, 2031. A phone can't load Google. Steam flickers on an old laptop. A device called NEATH appears on your home network, plugged into an empty port. You keep things running. Lately, things have started keeping track of you.",
    ),
    h("div", { class: "row", style: "justify-content:center;margin-bottom:16px" }, h("label", { style: "color:var(--muted)" }, "Your name ", nameInput)),
    h("div", { class: "slots" }, ...rows),
    h("p", { style: "color:var(--muted);font-size:13px;margin-top:18px" }, "Saves stay in this browser. Each slot saves automatically after every choice."),
  );
}

function render(): void {
  root.replaceChildren();
  ambience();
  if (!state) {
    root.append(h("div", { class: "app" }, titleScreen()));
    return;
  }
  const s = state;
  root.append(
    h(
      "div",
      { class: "app" },
      header(s, ui, actions),
      h("div", { class: "layout" }, nav(s, STORYLETS, ui, actions), h("main", {}, tabsBar(s, ui, actions), ...body(s, STORYLETS, ui, actions)), side(s)),
    ),
  );
}

render();
