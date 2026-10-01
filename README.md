# SIGNAL BENEATH

A choice-driven text RPG about family, technology, memory, infrastructure and keeping fragile systems alive. Dubbo, 2031.

You are **the Keeper**: a husband, dad, technician and reluctant investigator. A phone can't load Google. Steam flickers on an old laptop. A device called NEATH appears on the home network, plugged into an empty port. Something beneath the city has started connecting everything together.

## Play

```sh
npm install
npm run dev        # http://localhost:5173
```

## Verify

```sh
npm run verify     # typecheck + tests + production build
```

The tests include 200 random playthroughs of Chapter One. They fail if any seed gets stuck or never reaches the ending.

## What's built: Chapter One, "Name Resolution"

- **Day loop:** Morning → Day → Evening → Night. Attention is a daily budget. Each action at night adds more sleep debt than the last. Sleep debt cuts the next day's Energy.
- **Six attributes:** Watchful, Practical, Persuasive, Steady, Curious, Discernment. Checks give a 60% chance when the attribute equals the difficulty, and are harder on low Energy. The roll uses exactly the chance shown on screen. A successful check raises its attribute by 1, except Discernment, which only grows through reflective choices.
- **Meters:** Energy, Attention, Family Connection (repeating the same activity within a few days gives less each time), System Stability, Tech Debt, Trust (family, colleagues, clients, institutions, AI). **Noise** is hidden: you only see how the house *feels*, and high Noise reduces the next day's Attention.
- **Journal with evidence status:** each entry is marked CONFIRMED, PROBABLE, UNVERIFIED or FALSE ATTRIBUTION.
- **DadLAN view:** the network diagram and each machine's traits, both updated by your choices.
- **Quests:** The Google That Disappeared, the Chemist (Evidence vs Marketing), the Toshiba SSD, Laptop 06's flickering Steam (making a fix persist), the Quiet Switch, the LANCache Incident (Safe Deployment and Change Control), Finding Staff Health, DBO1-SIM induction, NeathBound after midnight, the Unknown Device, and the Chapter One close, THE BENEATH.

## Layout

```
src/engine/   deterministic rules: state, checks, effects, day cycle, save (no DOM)
src/content/  storylets by region, written as data plus small predicates
src/ui/       DOM rendering (text only, never innerHTML)
tests/        engine rules, content integrity, full random playthroughs
```

Adding content means adding a `Storylet` to a file in `src/content/`. The content tests check that every `next` link exists, every check has a failure outcome, and no mid-scene step can trap a player who has run out of Attention.

`awdagaer.cwp` is a Cakewalk Sonar project that was already in the repo. The game doesn't use it.
