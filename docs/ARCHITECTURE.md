# Architecture

```
src/engine/    rules: deterministic, no DOM, no storage (except save.ts), no Math.random
  types.ts       GameState, Storylet, Choice, Outcome, Effect
  state.ts       newGame(): starting attributes, meters, machines
  rng.ts         mulberry32 seeded RNG (state lives in GameState.rngState)
  checks.ts      successChance(): 60% × attribute ÷ difficulty, capped 100; ×1.25 difficulty at Energy ≤ 3
  effects.ts     applyEffects(): meters (clamped), qualities, trust, machines, journal, family (diminishing)
  engine.ts      menu(), openStorylet(), choose(), advancePhase(), the day/night cycle and sleep
  save.ts        three localStorage save slots (+ migration of the old single save)
src/content/   the story, as data
  dsl.ts         effect builders: meter(), set(), quality(), trust(), family(), journal(), trait(), thread()
  home.ts, workshop.ts, city.ts, dadlan.ts, night.ts      Chapter One
  consequences.ts                                         callbacks driven by earlier choices
  archive.ts, chapter2.ts                                 Chapter Two
  finale.ts                                               Act One finale + ending requirements
  quilt.ts       PROJECTS (93) and THREADS (50), ported from The Parris Quilt
  index.ts       ALL_STORYLETS / STORYLETS
src/ui/        rendering only (DOM, text nodes, never innerHTML)
  main.ts        title screen and save slots, UI state, wiring actions to the engine
  views.ts       header, locations nav, Keeper sidebar, tabs (Story, DadLAN, Journal, Threads, Project Quilt)
  sound.ts       optional Web Audio fan hum; volume follows hidden Noise and the chosen switch
  dom.ts         h() element builder
site/launcher.html   GitHub Pages root with two buttons (this game + The Parris Quilt)
scripts/build-site.sh   assembles site-dist/ = launcher + /chapter-one/ (this build) + /quilt/ (master:index.html)
scripts/threads-map.ts  generates docs/THREADS.md
tests/         engine rules, content integrity, random playthroughs, Chapter Two + consequences
```

## The model

The game is a **storylet engine** in the style of Fallen London. A `Storylet` is a titled scene with text and choices. It appears in the menu when its `phases` include the current phase and its `requires(state)` predicate passes.
- `once` storylets disappear after use (quality `done:<id>`).
- `daily` storylets appear at most once per in-game day (`daily:<id>` = day).
- `sceneOnly` storylets are reached only through another choice's `next`. They form multi-step scenes and can't be backed out of, so each must offer a free choice (enforced by tests).

A `Choice` can cost `attention` and/or `energy`, can have a `check` (attribute vs difficulty), and leads to an `Outcome` with `text`, `effects`, an optional `next` scene, and `advance` (move to the next phase).

**State changes only through `Effect`s.** Story progress lives in `qualities` (a string-to-number map; missing keys read as 0). Conventions:

| Prefix | Meaning |
|---|---|
| `done:`, `daily:` | engine bookkeeping |
| `lesson:` | a lesson learned (shown on the ending screen) |
| `clue:`, `record:`, `classified:`, `misfiled:` | investigation progress |
| `debt:` | a specific shortcut that will come back (see consequences.ts) |
| `thread:N` | one of the 50 threads discovered |
| `chapter` | 1 (default/0) or 2 |
| `ending:` / `game:ended` | finale outcome |
| `archive:depth`, `archive:integrity`, `archive:contaminated` | Archive mechanics |
| `beneath` | how much of the mystery the player has seen |

## The day

Morning → Day → Evening → Night. `advancePhase()` moves on.
- Choices made at night add sleep debt equal to the number of night actions so far (1, then 2, then 3…).
- Going to bed from Night restores `max(1, 6 − sleepDebt)` Energy, halves sleep debt, lowers Noise by 1, and resets Attention to `8 − floor(Noise / 4)` (minimum 3).

## Consequences (how earlier choices come back)

- **Tech Debt:** specific `debt:` qualities trigger specific callbacks (`marg-again`, `steam-returns`), and total Tech Debt ≥ 4 triggers `debt-due`.
- **System Stability:** below 35 triggers a daily morning outage; 70 or more gives a calm morning with +1 Attention.
- **Trust:** low family trust (≤ 3) triggers `partner-distant`; high (≥ 7) lets your partner remember 2004 (`partner-remembers`). Client trust ≥ 5 brings the certificate job early. Institutional trust ≥ 3 gets Biomed's report. AI trust ≥ 2 lets you talk to the Beneath in the finale.
- **Endings:** Preserve and Disconnect are always open. Federate needs Change Control plus Discernment 16. Local needs Family Connection 30. The ending screen's epilogue reflects family, Tech Debt and Archive contamination.

## The Archive (Chapter Two)

- `archive-terminal` is a hub. DATE RANGE descends through eras (2031 → 2020 → 2012 → 2004).
- The other search modes each find one record, which opens a classification scene with four statuses. A correct status adds `archive:integrity`; a wrong one adds `archive:contaminated`.
- Folder 2004 opens only with integrity ≥ 3 and contamination 0. "Review a record" fixes contamination.
- The lost chat needs two of three sources before it can be concluded.

## Invariants (tested)

- The chance shown equals the chance rolled (`tests/engine.test.ts`).
- Same seed plus same choices gives the same state.
- Every `next` exists, every check has a failure, every scene-only storylet is reachable and has a free exit.
- All 50 threads are marked somewhere; 200 random playthroughs finish both chapters with an ending.
