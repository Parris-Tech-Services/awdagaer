# Merge Handoff — Engine + Quilt

Claude can merge engine/UI code independently. This branch supplies content and data only.

## Division of labour

**Engine owner**
- Chapter One engine, checks, time, save schema, automated playthroughs.
- Quilt visual shell, locations, evidence panel, endings.
- No content duplication required from this branch.

**Content pack**
- `docs/QUEST-MAP.md`: all 50 recovered conversations mapped to campaign mechanics and delayed consequences.
- `data/project-quilt.json`: current discovered public project constellation. A missing live URL is intentionally `null`; do not invent one.
- This file: integration contract.

## Required merged-game behaviours

1. **Stats must gate or alter events.** Never display a stat that has zero behavioural effect.
2. **Delayed consequences.** At least Tech Debt, System Stability, Trust, Integrity, Family Connection and hardware state must echo later.
3. **Shared definitions.** UI odds/text and engine resolution must read the same challenge object.
4. **Evidence provenance.** FACT / OBSERVATION / MEMORY / HYPOTHESIS / TODO / QUESTION remain distinguishable.
5. **Corrections are positive progress.** FALSE ATTRIBUTION and corrected hardware identity should increase Integrity, not feel like failure.
6. **Project portals are real links.** If `live_url` is null, show Source only. Never synthesize a deployment URL.
7. **Private repos stay private.** This manifest contains only public/discovered nodes intended for a public game.
8. **No soft locks.** Automated playthroughs should cover both resource-poor and resource-rich routes.
9. **Endings are state-informed.** Preserve/Federate/Disconnect/Local reflect accumulated play.
10. **Mobile is first-class.** Android width is an acceptance test.

## Recommended merged save shape

```ts
{
  version,
  scene,
  day,
  phase,
  stats,
  resources: { attention, energy, sleepDebt, noise },
  relationships: { familyTrust, workTrust, institutionalTrust },
  systems: { techDebt, systemStability, changeControlUnlocked },
  hardware: Record<machineId, { state, upgrades, reliability }>,
  evidence: Record<evidenceId, { classification, source, confidence }>,
  quests: Record<questId, { state, outcome }>,
  unlocks,
  endingsSeen
}
```

Use a migration function for every save-schema version.

## Project Quilt UI

Each project node should support:
- name
- type
- story hook
- Enter World button only when live_url is verified
- Source button for repo_url
- connection tags to other nodes
- optional in-game discovery state

The Quilt should gradually reveal connections during play, but the user may still have a separate "All Projects" view for practical navigation.

## Immediate content target after merge

Build Act II / Archive first. It has the highest leverage because it connects:
- old email identities;
- false attribution;
- lost ChatGPT conversation;
- JoshMemory/offline audio;
- project commit history;
- folder 2004;
- the first chronological anomaly.

Do not make the 2004 anomaly automatically supernatural. Timestamp preservation/copying remains a plausible alternative until tested.
