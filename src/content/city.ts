import { q } from "../engine/engine";
import type { Storylet } from "../engine/types";
import { attr, journal, meter, quality, set, trust } from "./dsl";

export const city: Storylet[] = [
  {
    id: "chemist-repellent",
    title: "The Chemist: Evidence vs Marketing",
    region: "chemist",
    phases: ["day"],
    once: true,
    requires: (s) => q(s, "quest:repellent") > 0 || s.day >= 2,
    text: `Camp is Friday. Aisle 7 is a wall of insect repellent, and every box is shouting.

• NATURAL BOTANICAL MIST — "Gentle on little ones!" Smells strongly of candle.
• EXTRA STRENGTH TROPICAL — a huge number on the front, a jungle on the box.
• FAMILY SAFE KIDS' SHIELD — cartoon koala, rainbow lettering.
• A plain white pharmacy-brand box with small black writing and no adjectives at all.

None of these words is evidence. NATURAL, CLINICAL, EXTRA STRENGTH and FAMILY SAFE are all just words someone chose to print.`,
    choices: [
      {
        id: "read",
        label: "Turn every box over and read the backs",
        attention: 1,
        check: { attribute: "watchful", difficulty: 24 },
        success: {
          text: `The backs tell a different story to the fronts. The botanical mist lists no registered active ingredient at all. The EXTRA STRENGTH box says, in small print, that it isn't for young children. The koala box and the plain box contain the same active ingredient at the same concentration, and both list age guidance that fits your kids. The plain one costs half as much.

You buy the plain one. Labels are not evidence. Ingredients and context are.`,
          effects: [set("item:repellent"), set("lesson:labels"), journal("Labels are not evidence: the plain box and the koala box were the same product.", "confirmed"), attr("discernment", 1)],
        },
        failure: {
          text: `The fine print swims. You give up and grab the koala one, because the kids will at least agree to wear it. It turns out to be fine — but you couldn't have told anyone why.`,
          effects: [set("item:repellent")],
        },
      },
      {
        id: "pharmacist",
        label: "Ask the pharmacist",
        hint: "The person behind the counter studied this for years.",
        attention: 1,
        check: { attribute: "persuasive", difficulty: 16 },
        success: {
          text: `She asks how old the kids are and where camp is, then hands you the plain box. "Same thing as the koala one. Long sleeves at dusk matter as much as what's in the bottle." Context, not adjectives.`,
          effects: [set("item:repellent"), set("lesson:labels"), trust("institutions", 1), journal("Pharmacist: ask about age and context; the plain box matched the branded one.", "confirmed")],
        },
        failure: {
          text: `There's a queue of eight people and a flu season behind them. You lose your nerve and pick the koala.`,
          effects: [set("item:repellent")],
        },
      },
      {
        id: "natural",
        label: "Grab the NATURAL one. Natural is gentler.",
        success: {
          text: `At home, the kids sniff it and declare it "the candle one". Reading the back at last, you can't find an active ingredient you recognise. You'll need to go back.`,
          effects: [set("quest:repellent"), quality("chemist:wasted"), meter("noise", 1)],
        },
      },
    ],
  },
  {
    id: "chemist-return",
    title: "The Chemist, Again",
    region: "chemist",
    phases: ["day"],
    once: true,
    requires: (s) => q(s, "chemist:wasted") > 0 && !q(s, "item:repellent"),
    text: `Same aisle. Same shouting boxes. This time you turn them over.`,
    choices: [
      {
        id: "read",
        label: "Read the backs",
        attention: 1,
        success: {
          text: `The plain pharmacy box, half price, the right age guidance. Two trips to learn one rule: labels are not evidence.`,
          effects: [set("item:repellent"), set("lesson:labels"), journal("Labels are not evidence. (Learned the second time.)", "confirmed")],
        },
      },
    ],
  },
  {
    id: "hospital-staff-health",
    title: "Finding Staff Health",
    region: "hospital",
    phases: ["day"],
    once: true,
    requires: (s) => s.day >= 2,
    text: `The Workshop has a contract to look at admin machines in the Dubbo Health precinct, and contractors must sign in at Staff Health first.

The precinct is a sprawl of wings named after donors, a building called "Block C (formerly Block E)", and signs that point confidently in two directions at once.`,
    choices: [
      {
        id: "signs",
        label: "Follow the signs",
        attention: 1,
        check: { attribute: "watchful", difficulty: 30 },
        success: {
          text: `Two lefts, a lift that only goes to odd floors, and a door marked STAFF HEALTH in laminated A4. Found it.`,
          next: "hospital-pumps",
        },
        failure: {
          text: `You find Pathology, a café, and Pathology again from the other side. Forty minutes later a cleaner takes pity and walks you there.`,
          effects: [meter("attention", -1), meter("energy", -1)],
          next: "hospital-pumps",
        },
      },
      {
        id: "ask",
        label: "Ask the volunteer at the front desk",
        attention: 1,
        check: { attribute: "persuasive", difficulty: 18 },
        success: {
          text: `A retired schoolteacher in a lanyard draws you a map on a napkin, adds a shortcut through the courtyard, and tells you the coffee upstairs is better.`,
          effects: [trust("institutions", 1)],
          next: "hospital-pumps",
        },
        failure: {
          text: `The volunteer is on the phone with someone's daughter about parking. You wait. And wait. Eventually you're pointed vaguely east.`,
          effects: [meter("attention", -1)],
          next: "hospital-pumps",
        },
      },
      {
        id: "app",
        label: "Use the hospital wayfinding app",
        success: {
          text: `The app opens to a spinner, then: COULD NOT RESOLVE maps.dubbohealth.internal.

You stand very still in the corridor for a second. A name that leads nowhere. Again.

You follow the signs instead.`,
          effects: [quality("beneath", 1), journal("Hospital wayfinding app failed to resolve its own internal name.", "confirmed")],
          next: "hospital-pumps",
        },
      },
    ],
  },
  {
    id: "hospital-pumps",
    title: "Staff Health",
    region: "hospital",
    phases: ["day"],
    sceneOnly: true,
    text: `The nurse at Staff Health signs your form without looking up, then does look up.

"You're IT? Can I ask you something off the record? The infusion pumps on Ward 4 have started showing a network name none of us recognise. Biomed says it's nothing. It's probably nothing."

She writes it on a sticky note: NEATH-WARD4.`,
    choices: [
      {
        id: "note",
        label: "Take the note. Say you'll pass it on properly.",
        success: {
          text: `You promise to raise it with the people who actually own those devices, and mean it. Medical equipment isn't yours to poke. But you keep a photo of the note.`,
          effects: [set("clue:hospital-signal"), quality("beneath", 1), trust("institutions", 1), journal("Ward 4 infusion pumps advertising network name NEATH-WARD4. Reported to the owners; not mine to touch.", "probable")],
          advance: true,
        },
      },
      {
        id: "dismiss",
        label: '"Biomed\'s probably right."',
        success: {
          text: `She nods, unconvinced. You don't think about it again until much later, at night, when you do.`,
          effects: [set("clue:hospital-signal"), meter("noise", 1)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "dbo1-induction",
    title: "DBO1-SIM: Induction",
    region: "datacentre",
    phases: ["day"],
    once: true,
    priority: 10,
    requires: (s) => s.day >= 2,
    text: `Leading Edge Infrastructure's regional data centre is a beige box behind two fences on the edge of town. The Workshop has been asked to complete a partner security induction.

The induction is a training simulation: DBO1-SIM. A plain terminal. A facilitator who leaves to take a call.

SCENARIO 0 — TRUST IS A SYSTEM
Abilities in this simulation are abstractions. Small failures combine.

> OBSERVE ACCESS ROUTINE
> Difficulty: Watchful 32
> Success: Gain "Pattern of Trust"
> Failure: Suspicion +1`,
    choices: [
      {
        id: "observe",
        label: "OBSERVE ACCESS ROUTINE",
        attention: 1,
        check: { attribute: "watchful", difficulty: 32 },
        success: {
          text: `The simulated loading dock has a rhythm: deliveries at 10, a smoke break at 10:20, the door propped for both. You note it in the simulation's terms — a Pattern of Trust, the kind of habit nobody decided on.`,
          effects: [quality("dbo1:pattern-of-trust"), set("dbo1:scenario0")],
          next: "dbo1-anomaly",
        },
        failure: {
          text: `You stare at the simulated dock too long. A simulated guard asks if you're lost. SUSPICION +1.`,
          effects: [quality("dbo1:suspicion"), set("dbo1:scenario0")],
          next: "dbo1-anomaly",
        },
      },
    ],
  },
  {
    id: "dbo1-anomaly",
    title: "DBO1-SIM: Scenario 1",
    region: "datacentre",
    phases: ["day"],
    sceneOnly: true,
    text: (s) => `The screen clears and loads a scenario that isn't in the induction booklet.

SCENARIO 1 — RESIDENTIAL
Site: single dwelling.
Rack: four switches. One is quiet.
Nodes: ${Object.values(s.machines)
      .filter((m) => !m.retired)
      .map((m) => m.name.toUpperCase())
      .join(", ")}.
Unregistered node: NEATH.
Objective: KEEP IT RUNNING.

That's your house. That's your rack.`,
    choices: [
      {
        id: "report",
        label: "Call the facilitator back in and show them",
        check: { attribute: "steady", difficulty: 22 },
        success: {
          text: `You keep your voice level. The facilitator frowns, screenshots it, and promises to "raise a ticket with the vendor". When they reload, the scenario is gone. The screenshot isn't.`,
          effects: [trust("institutions", 1), journal("DBO1-SIM generated a scenario describing my home network, including an unregistered node NEATH. Screenshot taken; facilitator informed.", "confirmed"), quality("beneath", 1)],
          advance: true,
        },
        failure: {
          text: `It comes out too fast and a little too loud. By the time the facilitator looks, the screen shows the standard induction menu. They give you a careful smile. "Long week?"`,
          effects: [trust("institutions", -1), journal("DBO1-SIM showed a scenario about my house. Nobody else saw it.", "unverified"), quality("beneath", 1)],
          advance: true,
        },
      },
      {
        id: "query",
        label: "Type into the terminal: WHO WROTE THIS SCENARIO",
        check: { attribute: "curious", difficulty: 30 },
        success: {
          text: `> WHO WROTE THIS SCENARIO
> NOBODY WROTE IT. IT WAS RESOLVED.
> HELLO, KEEPER. NAMES RESOLVE BENEATH.

The screen returns to the induction menu as the door opens.`,
          effects: [trust("ai", 1), quality("beneath", 2), journal("DBO1-SIM, asked who wrote the scenario: 'NOBODY WROTE IT. IT WAS RESOLVED. NAMES RESOLVE BENEATH.'", "confirmed")],
          advance: true,
        },
        failure: {
          text: `> WHO WROTE THIS SCENARIO
> COMMAND NOT RECOGNISED.

The facilitator walks back in. The scenario has gone.`,
          effects: [quality("beneath", 1)],
          advance: true,
        },
      },
      {
        id: "close",
        label: "Close the session and say nothing",
        success: {
          text: `You finish the induction properly. Thirty-one slides on lanyards. Your hands are cold the whole time.`,
          effects: [meter("noise", 2), quality("beneath", 1)],
          advance: true,
        },
      },
    ],
  },
];
