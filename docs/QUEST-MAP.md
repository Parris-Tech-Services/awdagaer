# SIGNAL BENEATH — 50-Quest Campaign Map

This is a content handoff for the merged game. It is intentionally isolated from engine code so another agent can merge it without conflict.

## Campaign structure

- **Act I — Small Failures:** Home, DadLAN, Workbench, Chemist, Hospital, Work. The player learns that visible symptoms often come from deeper layers.
- **Act II — Memory:** Archive, NeathBound, JoshMemory, Buckland Blocks. Provenance, lost context, link rot, regression, identity and evidence classification become explicit mechanics.
- **Act III — Simulation:** DBO1-SIM and the wider Project Quilt begin reflecting the player's real systems. Separate projects repeat the same identifiers.
- **Act IV — Convergence:** Tech Debt, System Stability, Trust, Family Connection, hardware state and prior evidence all produce delayed consequences.
- **Act V — Keeper's Choice:** Preserve, Federate, Disconnect and Local are earned outcomes, not four unrestricted last-screen buttons.

## Integration rule

Every quest should do at least three things:

1. solve an immediate concrete problem;
2. teach or exercise one reusable system;
3. alter later state so the choice matters again.

A quest is not "implemented" merely because its prose exists. Its mechanic or consequence must be observable later.

| ID | Quest | Act | Location | Core system | Immediate problem | Primary state | Delayed consequence |
|---|---|---|---|---|---|---|---|
| Q01 | DBO1-SIM | Act III | Data Centre | security simulation | Scenario 0043 models DadLAN without authoring | Knowledge/Trust/Suspicion | Unlocks Keeper identity thread |
| Q02 | Google Won't Load | Act I | Home/DadLAN | diagnosis | Separate browser symptom from DNS/network cause | Watchful/System Stability | Teaches layered diagnosis |
| Q03 | The Finished Series | Act I | Archive | epistemic honesty | Do not assume reading/progress state | Integrity/Trust | Introduces verified-vs-assumed dialogue |
| Q04 | The LANCache Incident | Act I | DadLAN | change control | Network-wide DNS breaks phones | Tech Debt/System Stability | Unsafe shortcut can recur later |
| Q05 | The Chemist Shelf | Act I | Chemist | evidence literacy | Ingredient list versus marketing claims | Discernment | Unlocks Evidence vs Label passive |
| Q06 | Build the Cache | Act I | DadLAN | deployment | Verify forwarding, one client, Android, rollback | Practical/Integrity | Unlocks Change Control |
| Q07 | Flickering Steam | Act I | Workbench | persistence | Make workaround survive restart | Practical/System Stability | Temporary fixes stop counting as completion |
| Q08 | 169.254 | Act I | DadLAN | DHCP | No lease, isolate Ethernet/Wi-Fi paths | Watchful | Network topology clue |
| Q09 | The Loud Switches | Act I | DadLAN Rack | trade-off | Fast/noisy versus slow/quiet infrastructure | Discernment/Noise | Recurring performance-cost motif |
| Q10 | 404 Recovery | Act II | Archive | link rot | Recovery tool URL has disappeared | Curious/Integrity | Introduces internet-forgetting theme |
| Q11 | Benchmarks | Act I | Workbench | comparison | Compare fleet to unfamiliar hardware from evidence | Watchful | Fleet capability tags |
| Q12 | Disclosure Gap | Act III | Archive | timeline reconstruction | Separate event/discovery/understanding/disclosure dates | Integrity/Watchful | Chronology puzzle skill |
| Q13 | Chrome Again | Act I | Home | memory reuse | Recognise recurring DNS symptom | Watchful/Attention | Rewards retained context |
| Q14 | The Nasal Spray | Act I | Chemist | risk interpretation | Contextualise treatment benefits/downsides | Discernment | Health information provenance tutorial |
| Q15 | The Choice Game | Act II | NeathBound | genre research | Popularity differs from relevance/choice density | Curious | Unlocks Storylet design notes |
| Q16 | Staff Health | Act I | Hospital | memory verification | Admit uncertainty or locate the original record | Integrity/Trust | False certainty can close later help |
| Q17 | Inventory Day | Act I | DadLAN | asset inventory | Identify full machine fleet and roles | Practical | Hardware roster becomes gameplay party |
| Q18 | Updates Paused | Act I | Workbench | policy layers | UI says resume but policy says NoAutoUpdate | Watchful | Unlocks Layered Systems insight |
| Q19 | Policy Cleanup | Act I | Workbench | remediation | Remove underlying update policy cleanly | Practical/System Stability | Reduces future outage chance |
| Q20 | Stop Auto Login | Act I | DadLAN | access control | Trade convenience against trust boundary | Trust/System Stability | Affects later local-access event |
| Q21 | Vale | Act II | Archive | sensitive research | Research death without inventing missing cause | Integrity | Integrity gate for Archive chapter |
| Q22 | The Missing Artwork | Act II | NeathBound | visual regression | Build passes while experience regresses | Integrity/System Stability | Unlocks Visual Verification |
| Q23 | The Certificate | Act II | Medical Practice | institutional knowledge | Resolve certificate identity without inventing credentials | Trust/Watchful | Governance story arc |
| Q24 | Anatomy of a Storylet | Act II | NeathBound | design study | Translate choice-heavy UI patterns into own game | Curious | Unlocks storylet authoring |
| Q25 | What Is NeathBound? | Act II | NeathBound | navigation | Repair dead internal anchor | Practical | First obvious doorway motif |
| Q26 | Unique Location Artwork Done | Act II | Archive | lost context | Reconstruct project state from commits/screenshots/assets | Watchful/Integrity | Core lost-chat puzzle |
| Q27 | Twenty-Two Choices | Act II | NeathBound | exhaustive QA | Interface claims and engine truth disagree | Watchful/Integrity | Shared challenge-definition upgrade |
| Q28 | The Conversation That Wouldn't Open | Act II | Archive | redundancy | Recover project knowledge from alternate evidence | Curious | Archive dependency graph |
| Q29 | Right Person, Right Medication | Act I | Home/Health | provenance | Do not mix one person's record with another | Integrity/Trust | Identity-provenance mechanic |
| Q30 | Banana Pancakes | Act I | Home | family presence | Choose ordinary family action over another technical task | Family Connection/Steady | Diminishing returns prevents farming |
| Q31 | DNS Again | Act I | DadLAN | context efficiency | Known incident gets shortest safe fix path | Attention/System Stability | Rewards memory without pretending certainty |
| Q32 | Address History | Act II | Archive | identity archaeology | Recover historical email identities | Watchful | Builds identity graph |
| Q33 | False Attribution | Act II | Archive | correction | Remove addresses wrongly assigned to player | Integrity | Corrections become positive progress |
| Q34 | Mini | Act II | Studio | bounded AI | Create companion that only knows consented context | Trust | Counterpoint to Beneath |
| Q35 | Hepatitis Clearance | Act II | Health Archive | evidence boundaries | Immunity evidence does not prove dose history | Integrity | Evidence classification puzzle |
| Q36 | Oldest Thing | Act II | Archive | deep search | Find oldest surviving records across accounts | Curious/Attention | Leads to 2004 folder |
| Q37 | Missed Dose | Act I | Home/Health | time-sensitive provenance | Correct person, medication, time context | Trust/Integrity | Health record gate |
| Q38 | RATS | Act I | Work | action extraction | Convert messy email into quantities and actions | Practical | Unlocks Communication→Action skill |
| Q39 | Release Gate | Act II | Workbench | CI/CD | Prevent future game regressions | System Stability/Tech Debt | Reduces random regression events |
| Q40 | Chunk Revision | Act II | Buckland Blocks | state migration | World/save state survives engine changes | Practical | Prepares distributed-state theme |
| Q41 | Offline Means Offline | Act II | JoshMemory | acceptance criteria | Prove playback after network loss/restart | Integrity/System Stability | Unlocks Acceptance Criteria |
| Q42 | The Missing Audio | Act II | JoshMemory | irrecoverable data | Search honestly and accept when media is gone | Integrity/Steady | Loss can remain unresolved |
| Q43 | SSD Allocation | Act I | Workbench | scarcity | Allocate limited upgrades across old machines | Discernment | Hardware later modifies checks |
| Q44 | The Boarding House | Act II | Archive/Work | document research | Separate award text, accommodation, on-call facts | Watchful/Integrity | Complex-rule research quest |
| Q45 | Closed Sunday | Act I | Road/Canowindra | availability | Nearest resource is useless if closed | Discernment | Availability becomes resource property |
| Q46 | The Consultancy Beneath | Act III | Project Quilt | routing | A deployment fix reveals the word Beneath | Curious | Cross-project convergence begins |
| Q47 | Graphics Could Not Start | Act II | Buckland Blocks | failure UX | Make startup failure explicit, retryable and diagnosable | System Stability | Unlocks Fail Loudly |
| Q48 | Chooky Dancers | Act II | JoshMemory | media archaeology | Search for genuine old regional audio without substitution | Integrity/Curious | Regional memory thread |
| Q49 | Forensic Audit | Act I | Workbench | hardware forensics | Infer machine identity from software evidence | Watchful | Confidence/provenance mechanic |
| Q50 | The New Machine | Act I | Workbench | correction | Correct earlier GPU identification and assign role | Integrity/Practical | Shows corrections strengthen record |

## Delayed-consequence chains

### Unsafe infrastructure chain
Q04 LANCache shortcut → Tech Debt rises → Q13 repeated Chrome fault becomes harder → low System Stability can trigger a morning household outage → DBO1-SIM later reproduces the exact exception.

### Family-attention chain
Q30 and other home choices alter Family Connection and Trust. Repeating the same "family time" action gives diminishing stat returns, but specific relationship scenes remain narratively valuable. Low Trust should remove or alter later clues, not simply lower a number.

### Hardware chain
Q17 + Q43 + Q49 + Q50 create the machine roster. SSD/RAM/cooling/network choices attach capabilities to actual DadLAN nodes. Later diagnostics and DBO1-SIM scenarios should reference those nodes by state, not generic flavour text.

### Integrity chain
Q03/Q16/Q21/Q29/Q33/Q35/Q41/Q42/Q48 reward explicit uncertainty and correction. High Integrity unlocks the strongest Archive evidence tools and the Federate ending route. False certainty can create fast short-term progress but contaminated evidence later.

### Release-quality chain
Q22/Q27/Q39/Q47 teach that green CI != correct experience. Once Visual Verification + Acceptance Criteria + Fail Loudly are unlocked, future project quests become cheaper in Attention and less likely to create Tech Debt.

## Ending gates

- **Preserve:** Archive completeness high; Curiosity high; player repeatedly chose recovery over deletion. Cost: high Noise/maintenance burden.
- **Federate:** Integrity + Discernment high; at least three provenance/correction quests completed; bounded-AI/Mini thread understood; no single subsystem owns all data.
- **Disconnect:** Player has evidence of convergence but chooses containment; requires enough System Stability to shut down cleanly rather than panic.
- **Local:** Family Connection + Steady high; player has repeatedly demonstrated that not every open thread needs immediate resolution.

The ending screen may still present choices, but unavailable/unsafe routes should be explained by accumulated play state.

## Chapter Two: The Archive — recommended first content expansion

1. Search interface: known name / exact phrase / account / date / file type / relationship.
2. Evidence cards: CONFIRMED / PROBABLE / UNVERIFIED / FALSE ATTRIBUTION.
3. Identity graph from Q32/Q33.
4. Lost-chat reconstruction from Q26/Q28.
5. Oldest-record descent from Q36.
6. Folder 2004 finale: DADLAN-07 appears in metadata, but timestamp preservation remains a live mundane alternative.
7. No paranormal conclusion is promoted until mundane provenance explanations have been tested.

## Quest acceptance test template

For every implemented quest, verify:
- entry requirements can actually be reached;
- all choices render their real challenge odds;
- success and failure effects differ where intended;
- UI and engine read the same challenge definition;
- changed stats alter at least one later choice/event;
- save/reload preserves the result;
- mobile layout has no sideways scrolling;
- no route can soft-lock the campaign.
