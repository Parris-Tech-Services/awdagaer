// Consequences: the places where earlier choices come back.
// Tech Debt shortcuts return as faults, System Stability decides how mornings start,
// and Trust opens or closes options. See docs/ARCHITECTURE.md ("Consequences").
import { q } from "../engine/engine";
import type { Storylet } from "../engine/types";
import { attr, family, journal, meter, set, trust, thread } from "./dsl";

export const consequences: Storylet[] = [
  {
    id: "stability-outage",
    title: "Something's Down",
    region: "home",
    phases: ["morning"],
    daily: true,
    priority: 80,
    requires: (s) => s.day >= 2 && s.meters.systemStability < 35,
    text: (s) =>
      `System Stability has been sliding, and this morning it shows. ${
        s.machines.thinkpad?.traits.includes("DEPENDABLE") ? "The ThinkPad is fine; it's the router that's sulking." : "The cache node won't boot and the router's sulking."
      } The kids' tablets can't reach anything. Your partner is already looking at you.`,
    choices: [
      {
        id: "fix",
        label: "Fix it properly before work",
        attention: 2,
        check: { attribute: "practical", difficulty: 30 },
        success: {
          text: `A full power-cycle in the right order, a config you'd forgotten to save, and a note on the rack about both. Everything comes back, and stays back.`,
          effects: [meter("systemStability", 10), meter("techDebt", -1)],
          advance: true,
        },
        failure: {
          text: `You get it half back. Wi-Fi works; the cache doesn't. You leave late, with a knot in your stomach.`,
          effects: [meter("systemStability", 3), meter("noise", 2), meter("energy", -1)],
          advance: true,
        },
      },
      {
        id: "phones",
        label: "Put everyone on mobile data for today and deal with it tonight",
        hint: "A known workaround is not a hidden one.",
        success: {
          text: `"Hotspot off your phone, love. I'll fix it tonight." Nobody's thrilled. Nobody's stranded.`,
          effects: [meter("noise", 1), trust("family", 1)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "stability-calm",
    title: "Everything Just Works",
    region: "home",
    phases: ["morning"],
    daily: true,
    priority: 5,
    requires: (s) => s.day >= 2 && s.meters.systemStability >= 70,
    text: `No alerts. No sulking router. The cache served three overnight updates without anyone noticing. This is what all the boring work buys: a morning that belongs to you.`,
    choices: [
      {
        id: "enjoy",
        label: "Notice it. Then go and have breakfast.",
        success: {
          text: `You stand in the hallway for a moment and listen to nothing. Then toast.`,
          effects: [meter("attention", 1), meter("noise", -1)],
        },
      },
    ],
  },
  {
    id: "marg-again",
    title: "Chrome Again",
    region: "workshop",
    phases: ["day"],
    once: true,
    priority: 30,
    requires: (s) => s.day >= 4 && q(s, "debt:marg-dns") > 0,
    text: `Marg is back at the counter. "It's doing it again. Only at the bowling club this time."

Of course it is. You fixed her home Wi-Fi, not her phone. The dead Private DNS setting has been sitting there since, waiting for a network you hadn't patched.

Your journal says exactly this. Repeated symptoms deserve remembered causes.`,
    choices: [
      {
        id: "proper",
        label: "Remove the dead setting and the booster app this time",
        attention: 1,
        success: {
          text: `Two minutes. The fix you could have done last week. You apologise properly, and Marg, to her enormous credit, laughs. "Second time's the charm."`,
          effects: [thread(13), meter("techDebt", -1), trust("clients", 1), set("debt:marg-dns", 0), attr("discernment", 1), journal("Marg's phone failed again at the bowling club: the earlier hard-coded DNS workaround only covered her home Wi-Fi. Fixed at the source this time.", "confirmed")],
        },
      },
      {
        id: "again",
        label: "Patch the club's Wi-Fi too",
        hint: "You know the club's admin password. It'd be quicker.",
        success: {
          text: `Now two networks carry a workaround for one phone. You'll remember why. Probably.`,
          effects: [thread(13), meter("techDebt", 1), meter("noise", 1)],
        },
      },
    ],
  },
  {
    id: "steam-returns",
    title: "Saturday LAN: The Flicker Returns",
    region: "dadlan",
    phases: ["evening"],
    once: true,
    priority: 30,
    requires: (s) => s.day >= 3 && q(s, "steam:workaround") > 0,
    text: (s) =>
      `The LAN party is twenty minutes in when Steam updates itself, replaces its shortcuts, and Laptop 06 starts flickering like a dying tube light. ${
        q(s, "lesson:persistence")
          ? "Taped to the lid is your own label: STEAM: GPU ACCEL OFF — TEMP — SEE NOTES."
          : "You can't remember exactly what you did last time."
      }`,
    choices: [
      {
        id: "notes",
        label: "Follow the note on the lid",
        requires: (s) => q(s, "lesson:persistence") > 0,
        lockedReason: "You never wrote it down.",
        success: {
          text: `Thirty seconds, because past you wrote it down. The game resumes. You add one line to the note: "update breaks this — fix the driver."`,
          effects: [family("lan", 3), meter("noise", -1)],
        },
      },
      {
        id: "scramble",
        label: "Work it out again, with four kids watching",
        attention: 1,
        check: { attribute: "watchful", difficulty: 30 },
        success: {
          text: `You find it again. Fifteen minutes of game time, gone. Someone says "Dad's computers are always broken" and it stings more than it should.`,
          effects: [family("lan", 1), meter("noise", 1)],
        },
        failure: {
          text: `Laptop 06 sits the round out. Its player sits on the couch, being brave about it.`,
          effects: [trust("family", -1), meter("noise", 2)],
        },
      },
      {
        id: "root",
        label: "Swap the kid onto the Toshiba and fix the root cause tomorrow",
        requires: (s) => !s.machines.toshiba?.traits.includes("UNRELIABLE RELIC"),
        lockedReason: "The Toshiba isn't in a state to take a player.",
        success: {
          text: `The old relic you rescued carries a player through the whole tournament. Old does not mean useless.`,
          effects: [family("lan", 4), set("steam:root-tomorrow")],
        },
      },
    ],
  },
  {
    id: "debt-due",
    title: "The Workarounds Come Due",
    region: "home",
    phases: ["morning"],
    once: true,
    priority: 70,
    requires: (s) => s.day >= 3 && s.meters.techDebt >= 4,
    text: `Three small things break before eight. The cache node's disk fills, the kids' tablet loses Wi-Fi, and a temporary fix you don't remember turns out to have been load-bearing.

None of these are new problems. They're old shortcuts, all coming due at once.`,
    choices: [
      {
        id: "pay",
        label: "Spend the morning paying it down properly",
        attention: 4,
        success: {
          text: `Labels, notes, root causes. Slow, unglamorous, permanent. You end the morning with fewer things that can surprise you.`,
          effects: [meter("techDebt", -3), meter("systemStability", 8), attr("discernment", 1)],
          advance: true,
        },
      },
      {
        id: "patch",
        label: "Patch each one fast and get to work",
        success: {
          text: `Three new workarounds on top of the old ones. It holds. For now.`,
          effects: [meter("techDebt", 1), meter("noise", 2)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "partner-distant",
    title: "Two People Passing in a Hallway",
    region: "home",
    phases: ["evening"],
    once: true,
    priority: 40,
    requires: (s) => s.day >= 3 && s.trust.family <= 3,
    text: `Your partner says goodnight from the doorway of the study, to the back of your head. It takes you a minute to realise they'd stopped telling you things days ago: the school email, the car noise, the phone call from their mum.`,
    choices: [
      {
        id: "turn",
        label: "Turn around. Close the laptop. Ask.",
        check: { attribute: "steady", difficulty: 24 },
        success: {
          text: `It's awkward and then it isn't. The car noise is the heat shield. Their mum is fine. The school email was about camp. You hadn't been missing information. You'd been missing them.`,
          effects: [trust("family", 2), family("repair", 5), attr("discernment", 1)],
          advance: true,
        },
        failure: {
          text: `You ask, but you're still half in the terminal and they can hear it. "It's fine," they say. It isn't.`,
          effects: [trust("family", -1), meter("noise", 1)],
        },
      },
      {
        id: "later",
        label: '"Night, love." Keep working.',
        success: {
          text: `The door closes softly. That's worse than if it had banged.`,
          effects: [meter("noise", 2)],
        },
      },
    ],
  },
  {
    id: "partner-remembers",
    title: "Your Partner Remembers 2004",
    region: "home",
    phases: ["evening"],
    once: true,
    requires: (s) => q(s, "chapter") >= 2 && s.trust.family >= 7,
    text: `You've been telling your partner about the Archive, and about folder 2004, because lately you tell them things. They go quiet, then laugh.

"2004? That's the year you had that beige ThinkPad in your bedroom and wouldn't stop talking about 'a place where names go'. You made me read a design document. On a date."`,
    choices: [
      {
        id: "listen",
        label: '"…I did what?"',
        success: {
          text: `They remember more than you do: the ThinkPad's name was BENEATH-01, the document was called "neath.txt", and you abandoned it when uni started. You had no record of any of it. They did, in the way people do.`,
          effects: [set("clue:2004-thinkpad"), family("talk", 4), journal("Partner remembers: in 2004 I had a ThinkPad named BENEATH-01 and wrote a design doc called neath.txt about 'a place where names go'.", "probable")],
        },
      },
    ],
  },
  {
    id: "biomed-report",
    title: "Biomed Writes Back",
    region: "hospital",
    phases: ["day"],
    once: true,
    requires: (s) => s.day >= 4 && q(s, "clue:hospital-signal") > 0 && s.trust.institutions >= 3,
    text: `Because you reported the Ward 4 pumps properly, Biomed sends you a courtesy note. They found the cause: an old DHCP option on a forgotten network segment, configured in 2009 by a contractor. It was handing out a DNS search domain, neath.local, to anything that asked.

The contractor's name on the paperwork: Beneath Systems Pty Ltd (deregistered 2010).`,
    choices: [
      {
        id: "thank",
        label: "Thank them, and ask if the contractor's details survive anywhere",
        check: { attribute: "persuasive", difficulty: 24 },
        success: {
          text: `A scanned invoice. One name: a sole director. Your stomach drops slightly. It's a name you'll want to look for in the Archive.`,
          effects: [thread(46), set("clue:beneath-systems"), trust("institutions", 1), journal("Biomed: NEATH names on Ward 4 came from a 2009 DHCP option set by Beneath Systems Pty Ltd (deregistered 2010). Invoice exists.", "confirmed")],
        },
        failure: {
          text: `"That's all we've got, sorry." Still: a company name. A thread.`,
          effects: [thread(46), set("clue:beneath-systems"), journal("Biomed: NEATH names came from a 2009 DHCP option set by 'Beneath Systems Pty Ltd'.", "confirmed")],
        },
      },
    ],
  },
];
