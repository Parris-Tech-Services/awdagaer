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

The tests include 200 random playthroughs of both chapters. They fail if any seed gets stuck or never reaches an ending.

## What's built: Act One

Chapter One, "Name Resolution", and Chapter Two, "The Archive", cover all 50 threads and end in four endings decided by how you played. Full detail is in [`docs/STATUS.md`](docs/STATUS.md). **Agents: start with [`AGENTS.md`](AGENTS.md).**

Live: https://parris-tech-services.github.io/awdagaer/ (a launcher with this game and The Parris Quilt).

## Layout

```
src/engine/   deterministic rules: state, checks, effects, day cycle, save (no DOM)
src/content/  storylets by region, written as data plus small predicates
src/ui/       DOM rendering (text only, never innerHTML)
tests/        engine rules, content integrity, full random playthroughs
```

Adding content means adding a `Storylet` to a file in `src/content/`. The content tests check that every `next` link exists, every check has a failure outcome, and no mid-scene step can trap a player who has run out of Attention.

`awdagaer.cwp` is a Cakewalk Sonar project that was already in the repo. The game doesn't use it.
