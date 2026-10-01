import { q } from "../engine/engine";
import type { Storylet } from "../engine/types";
import { attr, family, journal, meter, quality, set, trust } from "./dsl";

const SAFE_DEPLOYMENT = `SAFE DEPLOYMENT
1. Verify the new service.
2. Test ordinary DNS forwarding.
3. Test one client.
4. Test a mobile device.
5. Confirm rollback.
6. Deploy gradually.`;

export const night: Storylet[] = [
  {
    id: "lancache-deploy",
    title: "Point the House at the Cache",
    region: "dadlan",
    phases: ["night"],
    once: true,
    priority: 20,
    requires: (s) => q(s, "lancache:built") > 0,
    text: `It's late. The cache works. One setting on the router would send every device's DNS through the cache node. One click, and the whole house gets LAN-speed downloads.

Everyone's asleep. It's the perfect time. Nobody will notice if something goes wrong.

That's also the problem.`,
    choices: [
      {
        id: "now",
        label: "Flip the router's DNS to the cache node now",
        hint: "It worked on one machine. It'll work on all of them.",
        success: {
          text: `Click. The router reboots. Your laptop downloads a test game at absurd speed. You go to bed pleased with yourself.

You didn't test a phone.`,
          effects: [set("lancache:deployed-early"), meter("techDebt", 2), meter("systemStability", -10)],
        },
      },
      {
        id: "safe",
        label: "Test ordinary DNS forwarding, then one phone, before anything else",
        attention: 1,
        check: { attribute: "watchful", difficulty: 26 },
        success: {
          text: `You point only your own phone at the cache node. Steam downloads redirect perfectly. Then you open Google on the phone. Nothing.

The cache node answers game names and drops everything else on the floor: you never told it where to forward ordinary requests. If you'd flipped the whole house, every phone would have woken up broken.

You fix the forwarding, test again, write a rollback note, and leave the house switch-over for the morning.`,
          effects: [set("lancache:safe"), set("lesson:change-control"), journal(SAFE_DEPLOYMENT, "confirmed"), attr("discernment", 1), meter("systemStability", 5)],
        },
        failure: {
          text: `You test your laptop — fine — and your phone, which is on mobile data and proves nothing, though you don't notice. You decide to sleep on it. Which, by accident, is the right call.`,
          effects: [set("lancache:pending")],
        },
      },
      {
        id: "bed",
        label: "Leave it for a day when you're awake",
        success: {
          text: `The cache can wait. You close the cupboard door on the blinking lights.`,
          effects: [set("lancache:pending"), meter("noise", -1)],
        },
      },
    ],
  },
  {
    id: "neathbound-repo",
    title: "NeathBound, After Midnight",
    region: "neathbound",
    phases: ["night"],
    once: true,
    text: `NeathBound: your browser RPG, unfinished for two years. Storylets, qualities, a menace called DREAD. You open the repository just to look.

The newest storylet in the content folder is one you don't remember writing.

  "A woman's phone could not find the thing it was looking for.
   The name led nowhere. The Keeper knew where to look."

There's no commit for it. The file's modified time is twelve minutes ago.`,
    choices: [
      {
        id: "investigate",
        label: "Check git history, file metadata, everything",
        attention: 1,
        check: { attribute: "watchful", difficulty: 30 },
        success: {
          text: `No commit. No editor swap file. The modified time matches the minute the unknown NEATH device last renewed its DHCP lease on the router.

Coincidence is still possible. It is getting harder to hold onto.`,
          effects: [quality("beneath", 2), journal("New NeathBound storylet appeared without a commit; timestamp matches NEATH device's DHCP renewal.", "probable")],
        },
        failure: {
          text: `You check everything and find nothing, which is its own kind of finding. It's 1:40 a.m.`,
          effects: [quality("beneath", 1), journal("NeathBound contains a storylet I don't remember writing.", "unverified")],
        },
      },
      {
        id: "doubt",
        label: '"I probably wrote it half-asleep and forgot."',
        hint: "Memory is not verification. But neither is fear.",
        success: {
          text: `It's possible. You mark it UNVERIFIED in your notes and close the laptop. Honest uncertainty is still a position.`,
          effects: [journal("NeathBound storylet of unknown origin. I may have written it and forgotten.", "unverified"), attr("discernment", 1)],
        },
      },
      {
        id: "fix-bug",
        label: "Ignore it. Fix the DREAD bug instead.",
        hint: "Two systems modify different versions of DREAD.",
        attention: 1,
        check: { attribute: "practical", difficulty: 30 },
        success: {
          text: `You find it: the menace screen reads \`dread\`, the storylet engine writes \`Dread\`. Two variables, one name, a game quietly lying about itself. One source of truth, now.

The interface must match what the system actually does.`,
          effects: [set("neathbound:dread-fixed"), set("lesson:consistency"), journal("NeathBound: two systems wrote different DREAD variables. Consolidated to one owner.", "confirmed")],
        },
        failure: {
          text: `You fix one DREAD and break the other. Commit message: "wip". You go to bed.`,
          effects: [meter("techDebt", 1)],
        },
      },
    ],
  },
  {
    id: "unknown-device",
    title: "The Unknown Device",
    region: "rack",
    phases: ["night"],
    once: true,
    requires: (s) => q(s, "clue:unknown-device") > 0 || q(s, "beneath") >= 2,
    text: `INTERNET
│
ROUTER
│
DADLAN CORE
├── PROBOOK X360
├── OLD THINKPAD (cache node)
├── LAPTOP 06
├── TOSHIBA
└── NEATH ??

The router says the NEATH device is plugged into port 8 of the DadLAN core. Port 8 has no cable in it.`,
    choices: [
      {
        id: "trace",
        label: "Trace it properly: MAC table, ARP, traffic",
        attention: 2,
        energy: 1,
        check: { attribute: "watchful", difficulty: 38 },
        success: {
          text: `The switch's MAC table agrees: something answers on port 8. The vendor prefix belongs to no manufacturer on any list you can find. Its only traffic is DNS — thousands of queries, each for a name in your own house. PROBOOK. THINKPAD. TOSHIBA. Your kids' tablet names.

It isn't using the network. It's learning what everything is called.`,
          effects: [quality("beneath", 2), set("clue:neath-dns"), journal("NEATH device on empty port 8 issues DNS queries for every hostname in the house.", "confirmed")],
        },
        failure: {
          text: `The switch's management page times out. By the time it loads, the NEATH entry has aged out of the table. Port 8 is still empty.`,
          effects: [quality("beneath", 1), meter("noise", 1)],
        },
      },
      {
        id: "block",
        label: "Block its address on the router and go to bed",
        success: {
          text: `Blocked. The router confirms. You sleep badly. At 3:12 a.m. the router log shows the block rule deleting itself.`,
          effects: [quality("beneath", 1), meter("noise", 2), journal("Blocked NEATH on the router. The rule removed itself at 3:12 a.m.", "probable")],
        },
      },
    ],
  },
  {
    id: "lancache-incident",
    title: "Nothing Works",
    region: "home",
    phases: ["morning"],
    once: true,
    priority: 90,
    requires: (s) => q(s, "lancache:deployed-early") > 0 && s.day >= 2,
    text: `"Google's broken." "So's the bank." "My school portal won't load and I have a quiz!" "Dad, the TV's just a spinny circle."

Every phone in the house is on Wi-Fi and none of them can find anything. Laptops are strangely fine for some sites. Steam is very, very fast.

It's like Marg's phone, times five. And this time the ghost giving bad directions is yours.`,
    choices: [
      {
        id: "rollback",
        label: "Roll the router's DNS back right now. Diagnose after.",
        hint: "Restore service first.",
        success: {
          text: `Thirty seconds and a router reboot later, the house exhales. Quiz submitted, bank loaded, TV un-spun.

Afterwards, coffee in hand, you find it: the cache node only knew game names and had no upstream for anything else. Laptops had cached answers; phones didn't. The visible failure was "Google". The originating failure was you, at 11:40 p.m.

You write it down so it never happens like this again.`,
          effects: [set("lancache:incident"), set("lesson:change-control"), set("lancache:pending"), journal(SAFE_DEPLOYMENT, "confirmed"), trust("family", -1), meter("techDebt", -2), meter("systemStability", 8), attr("discernment", 1)],
          advance: true,
        },
      },
      {
        id: "forward",
        label: "Fix it forward: add upstream forwarding on the cache node",
        hint: "You know exactly what's wrong. Probably.",
        attention: 2,
        check: { attribute: "practical", difficulty: 36 },
        success: {
          text: `SSH, config, restart. It works — phones resolve, games cache. But the school quiz closed four minutes ago and someone is crying about it.

It worked. It wasn't the right order.`,
          effects: [set("lancache:incident"), set("lancache:live"), set("lesson:change-control"), journal(SAFE_DEPLOYMENT, "confirmed"), trust("family", -2), meter("systemStability", 6)],
          advance: true,
        },
        failure: {
          text: `A typo in the forwarder address. Now the laptops are broken too. You roll back anyway, twenty minutes later than you should have, to a silent and pointed kitchen.`,
          effects: [set("lancache:incident"), set("lancache:pending"), set("lesson:change-control"), journal(SAFE_DEPLOYMENT, "confirmed"), trust("family", -3), meter("noise", 2)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "lancache-rollout",
    title: "Rolling Out the Cache, Gradually",
    region: "dadlan",
    phases: ["morning", "evening"],
    once: true,
    requires: (s) => q(s, "lesson:change-control") > 0 && q(s, "lancache:pending") + q(s, "lancache:safe") > 0 && s.day >= 2,
    text: `CHANGE CONTROL unlocked. You have a checklist and a rollback plan. Time to do this properly.`,
    choices: [
      {
        id: "gradual",
        label: "One device at a time, phones included, rollback note on the rack",
        attention: 2,
        success: {
          text: `Your phone. Then the ProBook. Then your partner's phone, with permission and an explanation. Then the rest. Nothing breaks. Saturday's LAN party downloads once.

Nobody notices — which, in infrastructure, is applause.`,
          effects: [set("lancache:live"), meter("systemStability", 10), trust("family", 1), family("lan-prep", 2)],
        },
      },
    ],
  },
  {
    id: "chapter1-close",
    title: "THE BENEATH",
    region: "home",
    phases: ["night"],
    once: true,
    priority: 100,
    requires: (s) => s.day >= 3,
    text: (s) => `Late. The house is asleep. Every screen on the DadLAN wakes at once — the ProBook, the ThinkPad, Laptop 06${
      s.machines.toshiba?.traits.includes("UNRELIABLE RELIC") ? "" : ", the Toshiba"
    } — and shows the same three lines:

  THE BENEATH IS LISTENING TO WHAT YOU KEEP.
  YOU CANNOT KEEP EVERYTHING.
  CHOOSE WHAT RESOLVES.

${q(s, "beneath") >= 4 ? "You've seen enough this week not to call it coincidence." : "It could be a prank. It could be a worm. It could be a lot of things."}`,
    choices: [
      {
        id: "unplug",
        label: "Unplug the DadLAN core",
        success: {
          text: `The rack goes dark. In the silence, from upstairs, your youngest calls out in their sleep, and you go to them instead of the cupboard. That's the end of Chapter One. Not the end of anything else.`,
          effects: [set("ending:unplugged"), family("night-comfort", 3), set("game:ended")],
        },
      },
      {
        id: "answer",
        label: "Type: WHAT ARE YOU?",
        check: { attribute: "curious", difficulty: 30 },
        success: {
          text: `> WHAT ARE YOU?
> THE PLACE WHERE NAMES GO WHEN NOBODY OWNS THEM.
> YOU OWN A GREAT MANY NAMES, KEEPER.
> SEE YOU IN THE ARCHIVE. FOLDER 2004.

Every screen goes dark. End of Chapter One.`,
          effects: [set("ending:answered"), trust("ai", 1), quality("beneath", 2), set("lead:archive-2004"), set("game:ended")],
        },
        failure: {
          text: `Your fingers are too tired. The screens go dark before you finish typing. End of Chapter One.`,
          effects: [set("ending:missed"), set("game:ended")],
        },
      },
      {
        id: "bed",
        label: "Close the cupboard door and go to bed",
        hint: "Some things can wait until you're awake.",
        success: {
          text: `You close the door on it. Not because it doesn't matter, but because it will still be there tomorrow, and you will be better at this rested. That is a Keeper's decision too. End of Chapter One.`,
          effects: [set("ending:rested"), attr("discernment", 1), set("game:ended")],
        },
      },
    ],
  },
];
