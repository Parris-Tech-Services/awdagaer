import { q } from "../engine/engine";
import type { Storylet } from "../engine/types";
import { attr, family, journal, meter, quality, set, trait, trust, thread } from "./dsl";

export const dadlan: Storylet[] = [
  {
    id: "toshiba-ssd",
    title: "The Toshiba and the Spare SSD",
    region: "dadlan",
    phases: ["evening", "night"],
    once: true,
    text: `On the shelf sits the Toshiba Satellite: recovered from a council clean-up, clicking hard drive, boots in roughly the time it takes to make tea.

In the drawer sits one spare 480 GB SSD. Just one. The ProBook would be faster with it. The ThinkPad would be less painful. The Toshiba would be… alive.

Old does not necessarily mean useless. But upgrades are scarce.`,
    choices: [
      {
        id: "toshiba",
        label: "Give the SSD to the Toshiba",
        hint: "Rescue the relic.",
        attention: 2,
        energy: 1,
        check: { attribute: "practical", difficulty: 28 },
        success: {
          text: `Eleven screws, one hidden under a rubber foot. Clone, swap, boot. The Toshiba comes up in nineteen seconds and sits there looking faintly surprised at itself.

From UNRELIABLE RELIC to SURPRISINGLY USEFUL. The kids claim it within the hour.`,
          effects: [thread(43),
            trait("toshiba", "SURPRISINGLY USEFUL", "UNRELIABLE RELIC"),
            { kind: "machine", id: "toshiba", patch: { storage: "480 GB SSD", reliability: 75, port: "DadLAN core" } },
            meter("systemStability", 5),
            family("toshiba-handover", 3),
            set("dadlan:busy"),
          ],
        },
        failure: {
          text: `The keyboard ribbon clip snaps as you lift it. The SSD goes in fine, the machine boots fast — and the keyboard doesn't work. USB keyboard for now. That's a workaround, not a fix.`,
          effects: [thread(43),
            trait("toshiba", "USB KEYBOARD ONLY", "UNRELIABLE RELIC"),
            { kind: "machine", id: "toshiba", patch: { storage: "480 GB SSD", reliability: 55, port: "DadLAN core" } },
            meter("techDebt", 1),
            set("dadlan:busy"),
          ],
        },
      },
      {
        id: "probook",
        label: "Put it in the ProBook as extra storage",
        hint: "Best machine gets better.",
        attention: 1,
        success: {
          text: `The ProBook, already fast, now has room for one more game library. It barely notices. The Toshiba stays on the shelf, clicking quietly to itself.`,
          effects: [{ kind: "machine", id: "probook", patch: { storage: "512 GB NVMe + 480 GB SSD" } }, meter("noise", 1)],
        },
      },
      {
        id: "thinkpad",
        label: "Give it to the ThinkPad",
        hint: "The one closest to becoming genuinely useful again.",
        attention: 2,
        check: { attribute: "practical", difficulty: 22 },
        success: {
          text: `The old ThinkPad, freed from its spinning disk, becomes a perfectly reasonable machine. Not exciting. Dependable. You suspect that's the point.`,
          effects: [thread(43), trait("thinkpad", "DEPENDABLE", "SLOW"), { kind: "machine", id: "thinkpad", patch: { storage: "480 GB SSD", reliability: 90 } }, meter("systemStability", 4), attr("discernment", 1)],
        },
        failure: {
          text: `A seized screw rounds off. You'll need an extractor. The ThinkPad goes back together with its old drive, faintly reproachful.`,
          effects: [quality("thinkpad:seized-screw"), meter("noise", 1)],
        },
      },
    ],
  },
  {
    id: "steam-flicker",
    title: "Laptop 06 Flickers",
    region: "dadlan",
    phases: ["evening", "night"],
    once: true,
    text: `Laptop 06 is the LAN party regular, and tonight Steam is flickering on it like a dying fluorescent tube. The kids want to play on Saturday.

You know a workaround: launch Steam with GPU acceleration switched off. It'll stop the flicker. Tonight.

The real question isn't "can you make it work?" It's "can you make it stay working?"`,
    choices: [
      {
        id: "workaround",
        label: "Apply the workaround and call it fixed",
        attention: 1,
        success: {
          text: `No flicker. Done. Except it's a launch flag in a shortcut, and the next Steam update will quietly replace that shortcut.`,
          effects: [set("steam:workaround"), meter("techDebt", 1), set("dadlan:busy")],
        },
      },
      {
        id: "temporary",
        label: "Apply the workaround, and label it TEMPORARY",
        hint: "A known workaround is not a hidden one.",
        attention: 1,
        success: {
          text: `You stick a label on the lid: STEAM: GPU ACCEL OFF — TEMP — SEE NOTES. And you write the notes. A temporary fix, accepted as temporary, is an honest fix.`,
          effects: [thread(7), set("steam:workaround"), set("lesson:persistence"), journal("Laptop 06 Steam flicker: workaround applied and labelled TEMPORARY. Root cause still unknown.", "confirmed")],
        },
      },
      {
        id: "root",
        label: "Find the root cause",
        attention: 3,
        energy: 1,
        check: { attribute: "watchful", difficulty: 34 },
        success: {
          text: `Event Viewer, then the display driver's version date: 2019. Windows Update has been offering the new one for months, and failing, because a policy key says NO AUTO UPDATE. Somebody set that, once, for a reason nobody wrote down.

You install the driver deliberately, test, reboot, test again. The flicker is gone and it stays gone.`,
          effects: [thread(7),
            trait("laptop06", "STABLE", "FLICKERS UNDER STEAM"),
            { kind: "machine", id: "laptop06", patch: { reliability: 80 } },
            set("lesson:persistence"),
            set("clue:update-policy"),
            journal("Laptop 06: an old 'NO AUTO UPDATE' policy blocked driver updates. The visible button lied about what the system would do.", "confirmed"),
            meter("systemStability", 4),
            set("dadlan:busy"),
          ],
        },
        failure: {
          text: `Event Viewer is a haystack of yellow triangles. At some point you realise you've been reading the same log entry for ten minutes. You apply the workaround out of sheer fatigue.`,
          effects: [set("steam:workaround"), meter("techDebt", 1), meter("energy", -1)],
        },
      },
    ],
  },
  {
    id: "quiet-switch",
    title: "The Quiet Switch",
    region: "rack",
    phases: ["evening"],
    once: true,
    text: `The rack holds four switches, and you can only justify running one as the DadLAN core.

• A fanless 100 Mbps unmanaged switch. Silent. Slow.
• The D-Link smart gigabit. One small fan, currently whining.
• A Cisco Catalyst-era switch. Fast. Loud. Older than one of your kids.
• An HP ProCurve-class enterprise switch. Very fast. Sounds like a hair dryer in a cupboard.

Fast switches tend to have fans.`,
    choices: [
      {
        id: "quiet",
        label: "The quiet one",
        success: {
          text: `Silence in the hallway. Game downloads crawl. Nobody complains about the noise, because there isn't any. Everything takes a little longer, and the house is calmer for it.`,
          effects: [thread(9), set("rack:switch", 1), meter("noise", -2), meter("systemStability", -2)],
        },
      },
      {
        id: "dlink",
        label: "The D-Link, after cleaning its fan",
        hint: "A compromise. Compromises need maintenance.",
        attention: 1,
        check: { attribute: "practical", difficulty: 20 },
        success: {
          text: `A paintbrush, a can of air, a fan that now merely hums. Gigabit, mostly quiet. Good enough is a real place.`,
          effects: [thread(9), set("rack:switch", 2), meter("systemStability", 3), attr("discernment", 1)],
        },
        failure: {
          text: `The fan comes apart in your hand. You put it back together and it now clicks as well as whines.`,
          effects: [set("rack:switch", 2), meter("noise", 2)],
        },
      },
      {
        id: "procurve",
        label: "The ProCurve. Maximum throughput.",
        success: {
          text: `The rack roars into life. Downloads fly. From the bedroom comes the unmistakable sound of someone getting up to shut a door.`,
          effects: [thread(9), set("rack:switch", 4), meter("systemStability", 6), meter("noise", 3), trust("family", -1)],
        },
      },
    ],
  },
  {
    id: "lancache-build",
    title: "Building the Game Cache",
    region: "dadlan",
    phases: ["evening"],
    once: true,
    text: `Every LAN party, the same game downloads four times over one internet connection. The fix is a local content cache: the first machine downloads it, the rest pull it from the cache node at LAN speed.

You build the cache node on the ThinkPad. It works when you point one machine at it by hand.

To make it automatic, the whole house's DNS has to send game-download names to the cache instead of the internet. That means changing DNS for every device you own.`,
    choices: [
      {
        id: "build",
        label: "Build it and test it on one machine",
        attention: 2,
        check: { attribute: "practical", difficulty: 26 },
        success: {
          text: `The cache node serves its first download at 900 Mbps. You grin at the rack like it's a dog that learned a trick. Now: switching the whole house over.`,
          effects: [thread(6), set("lancache:built"), set("dadlan:busy"), meter("systemStability", 2)],
        },
        failure: {
          text: `Container networking, a port conflict, and a typo you stare straight through four times. It works in the end, slowly. Now: switching the whole house over.`,
          effects: [thread(6), set("lancache:built"), set("dadlan:busy"), meter("energy", -1)],
        },
      },
    ],
  },
  {
    id: "dadlan-tinker",
    title: "Just Five Minutes on the Rack",
    region: "dadlan",
    phases: ["evening"],
    requires: (s) => s.day >= 2,
    text: (s) =>
      `The DadLAN rack blinks at you. ${q(s, "lancache:incident") ? "It's been a little sheepish since the cache incident." : "There's always one more thing."}`,
    choices: [
      {
        id: "tidy",
        label: "Label cables and update the network notes",
        attention: 1,
        success: {
          text: `Boring, permanent work. Future you will open this cupboard in a panic someday and find labels. Future you will be grateful.`,
          effects: [meter("systemStability", 3), meter("techDebt", -1)],
        },
      },
      {
        id: "experiment",
        label: "Start a new experiment",
        hint: "What if the cache node also ran a home media server?",
        attention: 2,
        check: { attribute: "curious", difficulty: 26 },
        success: {
          text: `It works! It is also now a third thing you need to keep running.`,
          effects: [quality("projects:open"), meter("noise", 1), meter("systemStability", -1)],
        },
        failure: {
          text: `It half-works. Half-working things are the loudest kind.`,
          effects: [quality("projects:open"), meter("noise", 2), meter("techDebt", 1)],
        },
      },
    ],
  },
];
