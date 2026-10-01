# SIGNAL BENEATH — Public Project Genealogy

## Scope

Known public identities searched:

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
- **1 public deployment-only node(s)**
- **157 total Quilt nodes**
- **16 currently promoted live deployment links**
- **14 curated lineage/variant families**
- **153 graph relationships**

Private repositories are excluded from the public source graph. Public deployments can exist as deployment-only nodes when their source is private or no longer publicly mapped.

## Relationship vocabulary

- **lineage-of:** strong provenance or explicit canonical-source evidence.
- **sibling-variant:** same concept, separate implementation.
- **probable family:** strong context/name evidence but incomplete provenance.
- **thematic connection:** story/world relationship only, never presented as code ancestry.

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


## Important collision

`Wild2` is a confirmed dangerous name collision:
- `Parris-Tech-Services/Wild2` = **DOVAHKIIN — The Last Dragonborn**.
- `joshuaparrisdadlan-stack/Wild2` = **Whispering Wilds Twine/Godot workspace**.

They must remain separate.

## Thematic domains

- **DadLAN laboratory:** 27 public repos
- **Archive and memory:** 5 public repos
- **Health and provenance:** 5 public repos
- **Work and institutions:** 14 public repos
- **AI, agents and accountability:** 5 public repos
- **Kingkiller story/lore shards:** 5 public repos
- **Playable and narrative worlds:** 56 public repos

## Narrative architecture

The graph is intentionally not one giant starburst. Domain anchors create the patchwork:

- JoshHub → playable worlds
- JoshMemory → archive/memory
- DadlanControlCentre + ForgeGrid → home lab/infrastructure
- HealthLens → health/provenance
- DCS Companion → work/institutions
- AgentCheck → AI/accountability
- RothfussMaps → Kingkiller shards
- SwordChronicles → Sword Coast lineage
- GroqChat 2 → AI-DM lineage
- NeathBound → storylet doorway
- SIGNAL BENEATH → stitches the domain anchors together

Use distinct visual styles for **lineage edges** and **story/thematic edges** so narrative association is never mistaken for proof of source ancestry.
