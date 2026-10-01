# Status

_Last updated: 2026-10-01, session https://claude.ai/code/session_01WpwDcRTdN4M7rzbtdaQXRN_

## Where things are

| Thing | Location |
|---|---|
| Main game source | branch `ccr-44f57a1d-38xyzm` (this branch) |
| The Parris Quilt (separate single-file version by another agent/session) | `master:index.html` |
| Live site | https://parris-tech-services.github.io/awdagaer/ (served from branch `gh-pages`) |
| Live site layout | `/` launcher · `/chapter-one/` main game (path kept from the first deploy) · `/quilt/` The Parris Quilt |
| Deploys | `.github/workflows/pages.yml` (written by the other agent; identical copies on `master` and this branch) runs on every push to either branch: it checks out this branch, runs tests, runs `scripts/build-site.sh`, writes `build-info.json` and pushes to `gh-pages`. Manual fallback: `npm run site`, then push `site-dist/` to `gh-pages`. |

**Branch situation:** this branch has never been merged into `master`. `master` has the Quilt (`index.html`) and the same `pages.yml`. **Another agent (GitHub account `joshualparris`) is actively working on both branches.** Fetch and rebase before you push; never force-push. Merging needs a decision from Josh about what `master:index.html` should be (both projects use a root `index.html`). Don't merge without asking.

## Built

- **Engine:** deterministic storylets; honest checks; Attention, Energy and sleep debt; diminishing family returns; hidden Noise; once and daily storylets; three save slots.
- **Chapter One, "Name Resolution" (days 1–3):** Google ticket, Chemist, Toshiba SSD, Steam flicker, Quiet Switch, LANCache incident, Staff Health, DBO1-SIM, NeathBound, unknown device, THE BENEATH.
- **Consequences:** Tech Debt callbacks, stability outages and calm mornings, trust-gated scenes, play-driven endings.
- **Chapter Two, "The Archive" (days 4+):** search modes, record classification, contamination and review, the lost chat, folder 2004 (the twist: THE BENEATH is the Keeper's own 2004 design, built by Jonah Parris of Perth via Beneath Systems Pty Ltd and left running in old council and hospital infrastructure), and around 25 side threads.
- **Act One finale:** four endings (Preserve / Federate / Disconnect / Local), adapted from The Parris Quilt.
- **All 50 threads** are in the game. See `docs/THREADS.md`.
- **UI:** the Quilt's visual style, locations nav (filter by region), Keeper sidebar, tabs (Story, DadLAN, Journal, Threads, Project Quilt with 93 projects and search), first-day tutorial, optional ambient sound, light mode, mobile layout.

## Open / next

1. **The rest of the brief.** `docs/BRIEF.md` stops mid-sentence in §22 (Release Gates). Sections 22 onward are missing. Ask Josh.
2. **Merge decision** for `master` (see above).
3. **The medical practice** is only a Workshop job (`certificate`); the brief describes it as its own region.
4. **Hardware progression (§9)** is shallow: one SSD choice, no RAM/OS/cooling upgrades, and machines can't be moved between ports yet.
5. **Release Confidence (§22)** exists as a quality (`release-confidence`) but isn't shown or used yet; waiting for the rest of §22.
6. **Soundtrack:** `awdagaer.cwp` (Cakewalk Sonar) can't be played in a browser. Josh could export it to audio for `sound.ts`.
7. **Balance:** random play reaches all four endings (≈ disconnect 39%, preserve 38%, local 19%, federate 4% over 300 seeds); folder 2004 needs careful play (random play never opens it, by design).

## Known issues

- `pages.yml` runs `npm test` but not the typecheck. The typecheck still runs inside `npm run build` (called by `build-site.sh`), so type errors fail the deploy too.
