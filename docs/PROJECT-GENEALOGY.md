# SIGNAL BENEATH — Public Project Genealogy

## Scope

This graph covers public repositories discovered across these known identities:

- `Parris-Tech-Services`
- `joshualparris`
- `joshuaparrisdadlan-stack`
- `joshuaparris-max`
- `parristechservices-prog`
- `topsecretcheese-del`

Current inventory:

- **149 public source repositories**
- **1 public deployment-only node**
- **150 total public Quilt nodes**
- **16 known live deployments**
- **12 curated lineage/variant families**
- **152 graph relationships**

This is a **public-only** map. Private repositories are deliberately excluded from the source graph. A public deployment may remain as a deployment-only node when its source is private or otherwise not publicly mapped.

## Relationship vocabulary

- **canonical / lineage-of:** a repository explicitly names a canonical source, has identical metadata/content evidence, or otherwise has strong provenance.
- **sibling variant:** same project concept, separate implementation.
- **probable family:** strong naming/context evidence, but not enough provenance yet to call it a confirmed ancestor/descendant.
- **thematic connection:** narrative/game-world relationship only; not a source-code ancestry claim.

## Curated families

### Whispering Wilds lineage

- **Confidence:** mixed-confirmed
- **Canonical:** Parris-Tech-Services/WhirringWilderness
- **Members:** `joshualparris/Whispering-Wilds`, `Parris-Tech-Services/whispering-wilds`, `joshuaparrisdadlan-stack/whispering-wilds`, `joshuaparrisdadlan-stack/whispering-wilds-test`, `joshuaparrisdadlan-stack/WhirringWilderness`, `Parris-Tech-Services/WhirringWilderness`, `joshuaparrisdadlan-stack/WhisperingWildsReloaded`, `joshuaparrisdadlan-stack/Wild2`
- **Evidence:** Original Python text adventure, PyScript/static browser branch, Twine/Godot workspace, and modern React/Vite branch all identify themselves as Whispering Wilds. Parris-Tech-Services/Wild2 is explicitly excluded: it is DOVAHKIIN, an unrelated Skyrim text adventure.

### Buckland Blocks lineage

- **Confidence:** confirmed
- **Canonical:** Parris-Tech-Services/BucklandBlocks
- **Members:** `Parris-Tech-Services/BucklandBlocks`, `Parris-Tech-Services/BucklandBlocks1`, `joshualparris/buckland-blocks-demo`, `joshuaparrisdadlan-stack/BucklandGame`
- **Evidence:** BucklandBlocks README declares itself canonical. BucklandBlocks1 has identical README/package blob hashes. buckland-blocks-demo declares itself a generated distribution copy. BucklandGame is retained as a probable older relative, not asserted as an exact mirror.

### JoshHub lineage

- **Confidence:** confirmed
- **Canonical:** joshualparris/JoshHub
- **Members:** `joshualparris/JoshHub`, `joshuaparrisdadlan-stack/JoshHub`
- **Evidence:** README.md and package.json blob hashes are identical in the two public copies.

### The Consultancy Beneath lineage

- **Confidence:** confirmed
- **Canonical:** joshualparris/the-consultancy-beneath
- **Members:** `joshualparris/the-consultancy-beneath`, `joshuaparrisdadlan-stack/the-consultancy-beneath`
- **Evidence:** README.md and package.json blob hashes are identical.

### JoshTapApp lineage

- **Confidence:** confirmed
- **Canonical:** joshualparris/JoshTapApp
- **Members:** `joshualparris/JoshTapApp`, `joshuaparrisdadlan-stack/JoshTapApp`
- **Evidence:** README.md blob hashes are identical.

### Campaign Copilot lineage

- **Confidence:** confirmed-lineage
- **Canonical:** Parris-Tech-Services/campaign-copilot
- **Members:** `Parris-Tech-Services/campaign-copilot`, `joshuaparrisdadlan-stack/campaign-copilot`
- **Evidence:** README.md blob hashes are identical; package metadata has drifted, so treat the second copy as an evolved mirror/variant rather than byte-identical.

### HealthLens lineage

- **Confidence:** confirmed-lineage
- **Canonical:** joshualparris/HealthLens
- **Members:** `joshualparris/HealthLens`, `Parris-Tech-Services/HealthLens`
- **Evidence:** package.json blob hashes are identical; README content differs, indicating documentation/evolution drift.

### Josh OS / firmware lineage

- **Confidence:** confirmed
- **Canonical:** joshuaparris-max/JoshOS
- **Members:** `joshuaparris-max/JoshOS`, `Parris-Tech-Services/JoshOS-Stage0`, `Parris-Tech-Services/JoshBIOS`
- **Evidence:** The canonical JoshOS README explicitly names all three repositories and assigns their roles: integration repo, Stage 0 product-track extraction, and firmware/bootloader research stack.

### Ashfaller / AshFallen lineage

- **Confidence:** high
- **Canonical:** Parris-Tech-Services/ashfaller
- **Members:** `Parris-Tech-Services/ashfaller`, `joshualparris/AshFallen`
- **Evidence:** Both identify as ASHFALLER: The Veil Between, a text-led sci-fantasy extraction RPG beneath Dubbo; dependency versions differ, indicating variants rather than an exact mirror.

### Elodin lore siblings

- **Confidence:** high-sibling
- **Canonical:** none; sibling implementations
- **Members:** `Parris-Tech-Services/ElodinDeepLore`, `Parris-Tech-Services/elodin-deep-lore`
- **Evidence:** Both are Elodin-focused Kingkiller lore projects, but their READMEs describe different structures. Treat as sibling implementations, not duplicates.

### Eleven Realms variants

- **Confidence:** probable
- **Canonical:** Parris-Tech-Services/Eleven-Realms
- **Members:** `Parris-Tech-Services/Eleven-Realms`, `Parris-Tech-Services/ElevenRealms`
- **Evidence:** Near-identical names. Eleven-Realms has a Vite package; ElevenRealms lacks README/package metadata. Keep as probable family until deeper history confirms.

### DCS Companion copies

- **Confidence:** probable
- **Canonical:** Parris-Tech-Services/DCSCompanion
- **Members:** `Parris-Tech-Services/DCSCompanion`, `joshuaparrisdadlan-stack/DCSCompanion`
- **Evidence:** Same repository name across known owner identities. The Parris-Tech-Services copy has full app metadata; alternate copy currently lacks comparable README/package evidence.


## Confirmed dangerous name collision

**Wild2 is not one lineage across accounts.**

- `Parris-Tech-Services/Wild2` identifies itself as **DOVAHKIIN — The Last Dragonborn**, a Skyrim/Elder Scrolls text adventure.
- `joshuaparrisdadlan-stack/Wild2` identifies itself as a **Whispering Wilds Twine/Godot workspace**.

The graph intentionally keeps them separate.

## Thematic domains

- **DadLAN laboratory:** 27 public repos
- **Archive and memory:** 5 public repos
- **Health and provenance:** 5 public repos
- **Work and institutions:** 14 public repos
- **AI, agents and accountability:** 5 public repos
- **Kingkiller story/lore shards:** 5 public repos
- **Playable and narrative worlds:** 56 public repos

## Normalised-name collision candidates

These are mechanical collision candidates, not automatic duplicate claims.

- **healthlens:** `joshualparris/HealthLens`, `Parris-Tech-Services/HealthLens`
- **joshhub:** `joshualparris/JoshHub`, `joshuaparrisdadlan-stack/JoshHub`
- **joshtapapp:** `joshualparris/JoshTapApp`, `joshuaparrisdadlan-stack/JoshTapApp`
- **theconsultancybeneath:** `joshualparris/the-consultancy-beneath`, `joshuaparrisdadlan-stack/the-consultancy-beneath`
- **campaigncopilot:** `joshuaparrisdadlan-stack/campaign-copilot`, `Parris-Tech-Services/campaign-copilot`
- **dcscompanion:** `joshuaparrisdadlan-stack/DCSCompanion`, `Parris-Tech-Services/DCSCompanion`
- **whirringwilderness:** `joshuaparrisdadlan-stack/WhirringWilderness`, `Parris-Tech-Services/WhirringWilderness`
- **whisperingwilds:** `joshuaparrisdadlan-stack/whispering-wilds`, `Parris-Tech-Services/whispering-wilds`
- **wild2:** `joshuaparrisdadlan-stack/Wild2`, `Parris-Tech-Services/Wild2`
- **anchorflow:** `Parris-Tech-Services/AnchorFlow`, `parristechservices-prog/AnchorFlow`
- **elevenrealms:** `Parris-Tech-Services/Eleven-Realms`, `Parris-Tech-Services/ElevenRealms`
- **waypoint:** `Parris-Tech-Services/Waypoint`, `parristechservices-prog/Waypoint`

## Narrative architecture

Rather than connecting all 149 repos directly to SIGNAL BENEATH, the graph uses domain anchors:

- **JoshHub** catalogues story/game worlds.
- **JoshMemory** anchors archive and memory nodes.
- **DadlanControlCentre / ForgeGrid** anchor DadLAN infrastructure.
- **HealthLens** anchors health and provenance.
- **DCS Companion** anchors work/institutional systems.
- **AgentCheck** anchors AI accountability.
- **RothfussMaps** anchors Kingkiller lore shards.
- **NeathBound** is the major choice/storylet doorway.
- **SIGNAL BENEATH** stitches those domains together.

That produces an actual web rather than one giant starburst around SIGNAL BENEATH.

## Rendering recommendation

Use two modes:

1. **Practical Project Directory:** searchable list of every node with Play/Source buttons.
2. **Story Constellation:** graph view that initially reveals only discovered nodes and meaningful edges.

Lineage edges should use a different visual treatment from thematic/story edges, so the UI never implies that a narrative connection is proof of source-code ancestry.
