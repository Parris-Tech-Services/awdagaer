# SIGNAL BENEATH — Public Project Genealogy

## Scope

This is the public project/web archaeology layer for the Project Quilt. It currently covers **eight known public GitHub identities**:

- `Parris-Tech-Services`
- `joshualparris`
- `joshuaparrisdadlan-stack`
- `joshuaparris-max`
- `parristechservices-prog`
- `topsecretcheese-del`
- `parristechservices1-beep`
- `joshuaparris`

Current inventory:

- **156 public source repositories**
- **13 deployment-only public nodes**
- **169 total Quilt nodes**
- **52 nodes with a verified primary live link**
- **85 verified live portals including alternate builds**
- **16 curated lineage/variant families**
- **182 explicit graph relationships**

Private repositories are deliberately excluded from this public source graph. If a public app/game is live but its source is private or cannot be mapped confidently, it can appear only as a deployment-only node.

## Relationship vocabulary

- **lineage-of:** explicit canonical-source evidence or strong provenance.
- **sibling-variant:** same project concept, separate implementation.
- **probable family:** context/name evidence exists, but ancestry is not proven.
- **thematic/story edge:** narrative association only; never presented as source-code ancestry.
- **hosts-build:** a public deployed build recovered from a hub/catalogue without a confidently public source repo.

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

- **Confidence:** mixed-confirmed
- **Canonical:** joshualparris/JoshTapApp
- **Members:** `joshualparris/JoshTapApp`, `joshuaparrisdadlan-stack/JoshTapApp`, `parristechservices1-beep/JoshTapApp`
- **Evidence:** README.md blob hashes are identical. A third public historical copy exists under parristechservices1-beep but lacks comparable top-level metadata, so its exact mirror status is not asserted.

### Campaign Copilot lineage

- **Confidence:** confirmed-lineage
- **Canonical:** Parris-Tech-Services/campaign-copilot
- **Members:** `Parris-Tech-Services/campaign-copilot`, `joshuaparrisdadlan-stack/campaign-copilot`, `parristechservices1-beep/campaign-copilot`
- **Evidence:** README.md blob hashes are identical; package metadata has drifted, so treat the second copy as an evolved mirror/variant rather than byte-identical. The parristechservices1-beep copy has the same README and package.json blob hashes as the Parris-Tech-Services copy.

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

### Chronicles of the Sword Coast lineage

- **Confidence:** confirmed
- **Canonical:** joshuaparris/SwordChronicles
- **Members:** `joshuaparris/SwordChronicles`, `Parris-Tech-Services/SwordCoast`, `Parris-Tech-Services/dndgame`
- **Evidence:** SwordCoast README explicitly points to joshuaparris/SwordChronicles as the repository for Chronicles of the Sword Coast. dndgame carries the same title and rebuilt-legacy description and represents the same game family.

### GroqChat Dungeon Master lineage

- **Confidence:** confirmed-lineage
- **Canonical:** joshuaparris/groqchat2
- **Members:** `joshuaparris/groqchat`, `joshuaparris/groqchat2`
- **Evidence:** Both identify as GROQCHAT and implement the same Groq-powered Dungeon Master chatbot concept. groqchat2 is a later-generation stack (Next 16/React 19 versus Next 14/React 18), so it is an evolution rather than an exact mirror.

### AnchorFlow placeholder → active app

- **Confidence:** confirmed
- **Canonical:** parristechservices-prog/AnchorFlow
- **Members:** `Parris-Tech-Services/AnchorFlow`, `parristechservices-prog/AnchorFlow`
- **Evidence:** The Parris-Tech-Services README explicitly says it is an empty placeholder and recommends redirecting/archiving it if active AnchorFlow development exists elsewhere. parristechservices-prog/AnchorFlow contains the implemented local-first wellbeing/professional-growth app.

### Waypoint sibling implementations

- **Confidence:** high-sibling
- **Canonical:** parristechservices-prog/Waypoint
- **Members:** `Parris-Tech-Services/Waypoint`, `parristechservices-prog/Waypoint`
- **Evidence:** Both are local-first decision/growth tools but materially different implementations: Parris-Tech-Services/Waypoint is a compact five-question personal decision navigator; parristechservices-prog/Waypoint is a much broader professional-growth, wellbeing and downtime-readiness hub.


## Important collision

`Wild2` is a confirmed dangerous same-name collision:

- `Parris-Tech-Services/Wild2` is **DOVAHKIIN — The Last Dragonborn**, a Skyrim/Elder Scrolls text adventure.
- `joshuaparrisdadlan-stack/Wild2` is a **Whispering Wilds Twine/Godot workspace**.

They are intentionally separate nodes.

## Thematic domains

- **DadLAN laboratory:** 27 nodes
- **Archive and memory:** 5 nodes
- **Health and provenance:** 5 nodes
- **Work and institutions:** 14 nodes
- **AI, agents and accountability:** 7 nodes
- **Kingkiller story/lore shards:** 5 nodes
- **Playable and narrative worlds:** 70 nodes
- **Hubs and platform surfaces:** 6 nodes
- **Deployment-only archaeology:** 12 nodes

## Live-link archaeology

The first broad candidate audit tested **60 additional historical/project URLs** from JoshHub and repository documentation:

- **48 returned HTTP success**
- **12 were stale/404**
- a successful HTTP response is still not enough by itself: protected-login redirects and deliberately non-Quilt personal/property portals are not auto-promoted
- all currently promoted manifest links are rechecked by GitHub Actions

Stale URLs remain in `data/project-live-candidates.json` as provenance rather than being silently forgotten. The UI should hide them from normal Play buttons while retaining them for project archaeology/debugging.

## Narrative architecture

The graph is deliberately a patchwork rather than one giant starburst. Major anchors are:

- **JoshHub** → game/app portals and deployment archaeology
- **JoshMemory** → archive and memory
- **DadlanControlCentre / ForgeGrid** → home-lab infrastructure
- **HealthLens** → health-data/provenance tools
- **DCS Companion** → work/institutional systems
- **AgentCheck** → AI accountability
- **RothfussMaps** → Kingkiller lore shards
- **SwordChronicles** → Chronicles of the Sword Coast lineage
- **GroqChat 2** → AI-DM lineage
- **NeathBound** → choice/storylet doorway
- **SIGNAL BENEATH** → stitches those domains together

## Rendering recommendation

The merged game should expose two views:

1. **Project Directory** — practical, searchable, every public node, verified Play buttons and Source buttons.
2. **Story Constellation** — graph view with discovered nodes and story/lineage edges.

Use distinct visual treatments for source lineage, alternate deployments, and narrative connections. A narrative edge must never imply that one repo descended from another.
