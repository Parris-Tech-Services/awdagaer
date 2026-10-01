# AGENTS.md: read this first

You are working on **SIGNAL BENEATH**, a choice-driven browser text RPG (Dubbo, 2031) about family, technology, memory and keeping fragile systems alive.

**Before changing anything, read:**
1. [`docs/STATUS.md`](docs/STATUS.md): what's built, what's open, known issues and the branch situation.
2. [`docs/CONVERSATION_LOG.md`](docs/CONVERSATION_LOG.md): what Josh asked for and why things are the way they are.
3. [`docs/BRIEF.md`](docs/BRIEF.md): the design brief (verbatim; **truncated at §22**).
4. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): how engine, content and UI fit together.

## Repository facts

- `src/` is the source of truth for the main game. `dist/` and `site-dist/` are generated; never edit them by hand.
- `gh-pages` is a **deploy-only** branch, rebuilt by `scripts/build-site.sh` (locally) or `.github/workflows/deploy-site.yml` (CI). Never hand-edit it.
- `awdagaer.cwp` is Josh's Cakewalk Sonar project that was in the repo first. **Don't delete or modify it.**
- The live site: https://parris-tech-services.github.io/awdagaer/ has a launcher with two buttons, the main game (`/chapter-one/`) and "The Parris Quilt" (`/quilt/`, copied from `master:index.html`).
- **Two lines of work exist.** `master` holds a separate single-file version ("The Parris Quilt") built by another agent or session. The engine game lives on the session branch (see STATUS). Don't overwrite `master:index.html` without Josh's say-so; the launcher depends on it.

## Rules that must stay true

- **The engine is deterministic.** No `Math.random()`, `Date.now()`, DOM or storage under `src/engine/` or `src/content/`. All randomness comes from the seeded RNG in `GameState`.
- **Checks are honest.** The chance shown in the UI is exactly the chance used by the roll (`successChance` in `src/engine/checks.ts`). This is a theme of the game (brief §20, NeathBound's bug), not just good practice.
- **Noise is hidden.** Never show the Noise number; only show `houseFeel()` text.
- **Discernment is never raised by winning rolls**, only by specific reflective choices (brief §5).
- **Family Connection can't be farmed.** Use the `family` effect, which applies diminishing returns.
- **No real intrusion techniques** in DBO1-SIM or certificate quests (brief §3). Security actions are abstract RPG abilities.
- **Health stays grounded.** No medical advice framed as fact; the Chemist teaches "labels are not evidence", not product recommendations.
- **No player can get stuck.** Every scene-only storylet needs a free way forward (a choice costing no Attention or Energy). The content tests enforce this.
- Text is rendered as text (`textContent`), never `innerHTML`.

## Adding content

1. Add a `Storylet` to the right file in `src/content/` (one file per region or chapter) and export it through `src/content/index.ts`.
2. Use the builders in `src/content/dsl.ts` for effects.
3. Every `check` needs a `failure`. Every `next` must exist. Use `once: true` for one-off scenes.
4. Write consequences as qualities (`set("debt:something")`) that later storylets read in `requires`.
5. Run `npm run verify`. The random-playthrough test will catch dead ends.

## Verify before pushing

```sh
npm run verify            # typecheck + vitest + production build
./scripts/build-site.sh   # assemble the Pages site into site-dist/ (optional local check)
```

For visible UI changes, check in a real browser (`npm run dev`) and take before/after screenshots.

## Keep the docs current

When you finish work, **append to `docs/CONVERSATION_LOG.md`** (verbatim user requests plus a summary of what you did) and **update `docs/STATUS.md`**. Those two files are how the next agent knows what's happening.
