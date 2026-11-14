# Project Quilt Integration Guide

The content branch now provides a public Project Quilt as two complementary data layers:

- `data/project-quilt.json` — practical project directory, source repositories, verified primary/alternate live URLs, family membership and story metadata.
- `data/project-graph.json` — graph-ready nodes and edges for the in-game Story Constellation.

## UI contract

### Project Directory

Every public node can render:

- project name
- type
- domain/region
- story hook
- **Play** when `live_url` is present
- **Alternate build** buttons from `alternate_live_urls`
- **Source** when `repo_url` is present
- family/lineage badge when `family_ids` is non-empty

Never synthesize a URL from a repository name.

### Story Constellation

The graph should initially reveal only discovered story nodes, with an optional "show all public projects" practical mode.

Edge types must be visually distinct:

- `lineage-of` — source/provenance relationship
- `sibling-variant` — same concept, separate implementation
- `catalogues-world` / `hosts-build` — hub/deployment relationship
- thematic/story relations — lore only

A lore edge must never be presented as source ancestry.

## Canonical vs alternate deployments

A project can have one primary `live_url` and several `alternate_live_urls`. This is deliberate.

Examples include:
- canonical modern build + older GitHub Pages/itch build
- source repo + JoshHub-hosted static copy
- digital game + tabletop/Fables world

The player should be able to open alternates from an "Other portals" disclosure without cluttering the primary card.

## Stale-link handling

`data/project-live-candidates.json` is archaeological input, not a UI catalogue.

- promoted links have passed the automated HTTP audit and appear in `project-quilt.json`
- stale/404 links remain in the candidate file as provenance
- a candidate that returns HTTP 200 may still be excluded if it is auth-protected or intentionally outside the public game Quilt
- GitHub CI fails only when a **promoted manifest URL** breaks

## Privacy rule

The public Quilt contains public source repositories and deliberately selected public deployments. Do not automatically ingest private repositories, private documents, account-only Drive links, or personal/property-specific pages merely because another historical catalogue referenced them.

## Current scale

At this handoff:
- 156 public source repositories
- 13 deployment-only public nodes
- 169 total nodes
- 52 nodes with a verified primary live link
- 85 verified portal URLs including alternates
- 16 curated lineage/variant families
- 182 graph relationships

These numbers are generated from the known identities and evidence currently discovered; they are not a claim that no other historical project exists elsewhere.

## Engine integration

Import the data rather than retyping it. The engine may layer unlock/discovery state over these immutable project IDs.

Recommended player state:

```ts
projectDiscovery: Record<string, {
  discovered: boolean
  visited: boolean
  discoveredVia?: string
}>
```

Do not copy live-link status into save files; link health is external/current data, not player progression.
