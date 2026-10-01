import "./style.css";
import { advancePhase, choose, closeStorylet, openStorylet, phaseLabel } from "../engine/engine";
import { clearStorage, loadFromStorage, saveToStorage } from "../engine/save";
import { newGame } from "../engine/state";
import type { GameState } from "../engine/types";
import { STORYLETS } from "../content";
import { h } from "./dom";
import { type Actions, dadlanTab, journalTab, sidebar, storyTab, type Tab } from "./views";

const root = document.getElementById("app")!;
let state: GameState | null = loadFromStorage();
let tab: Tab = "story";

function update(next: GameState) {
  state = next;
  saveToStorage(next);
  render();
  window.scrollTo({ top: 0 });
}

const actions: Actions = {
  open: (id) => state && update(openStorylet(state, STORYLETS, id)),
  back: () => state && update(closeStorylet(state, STORYLETS)),
  choose: (id) => state && update(choose(state, STORYLETS, id)),
  advance: () => state && update(advancePhase(state)),
  tab: (t) => {
    tab = t;
    render();
  },
  newGame: () => {
    clearStorage();
    state = null;
    tab = "story";
    render();
  },
};

function titleScreen(): HTMLElement {
  const input = h("input", { "aria-label": "Your name", value: "The Keeper", maxlength: "32" });
  const start = () => {
    const seed = (Date.now() ^ (Math.random() * 0x7fffffff)) | 0;
    update(newGame(seed, input.value.trim() || "The Keeper"));
  };
  return h(
    "div",
    { class: "title-screen" },
    h("h1", {}, "SIGNAL BENEATH"),
    h(
      "p",
      {},
      "Dubbo, 2031. A phone can't load Google. Steam flickers on an old laptop. A strange device appears on the home network. You keep things running. Lately, things have started keeping track of you.",
    ),
    h("div", { class: "row", style: "justify-content:center" }, input, h("button", { class: "primary", onclick: start }, "Begin")),
  );
}

function render() {
  root.replaceChildren();
  if (!state) {
    root.append(h("div", { class: "shell" }, titleScreen()));
    return;
  }
  const s = state;
  const tabButton = (t: Tab, label: string) =>
    h("button", { "aria-pressed": tab === t ? "true" : "false", onclick: () => actions.tab(t) }, label);
  const body = tab === "story" ? storyTab(s, STORYLETS, actions) : tab === "dadlan" ? dadlanTab(s) : journalTab(s);
  root.append(
    h(
      "div",
      { class: "shell" },
      h(
        "header",
        { class: "top" },
        h("h1", {}, "SIGNAL BENEATH"),
        h("span", { class: "when" }, `Day ${s.day} · ${phaseLabel(s.phase)}`),
        h(
          "nav",
          { class: "tabs", "aria-label": "Views" },
          tabButton("story", "Story"),
          tabButton("dadlan", "DadLAN"),
          tabButton("journal", `Journal (${s.journal.length})`),
          h("button", { onclick: () => confirm("Start a new game? This replaces your save.") && actions.newGame() }, "New game"),
        ),
      ),
      sidebar(s),
      h("main", {}, ...body),
    ),
  );
}

render();
