// The Act One finale: "What are you trying to keep alive?" (endings from The Parris Quilt,
// master:index.html). Which endings are open depends on how the game was played.
import { q } from "../engine/engine";
import type { GameState, Storylet } from "../engine/types";
import { set, trust } from "./dsl";

export const FINALE_REQUIREMENTS = {
  federate: (s: GameState) => s.attributes.discernment >= 16 && q(s, "lesson:change-control") > 0,
  local: (s: GameState) => s.meters.familyConnection >= 30,
  ask: (s: GameState) => s.trust.ai >= 2,
};

export const ENDINGS = {
  preserve: "PRESERVE EVERYTHING",
  federate: "FEDERATED QUILT",
  disconnect: "DISCONNECT",
  local: "THE LOCAL ENDING",
} as const;
export type EndingId = keyof typeof ENDINGS;

export const finale: Storylet[] = [
  {
    id: "finale",
    title: "What Are You Trying to Keep Alive?",
    region: "datacentre",
    phases: ["night"],
    once: true,
    priority: 100,
    requires: (s) => q(s, "chapter") >= 2 && (q(s, "archive:2004-opened") > 0 || s.day >= 7),
    text: (s) => `Late. You're at the DBO1-SIM terminal${q(s, "archive:2004-opened") ? ", because you know now where this ends" : ""}. The screen fills with names: every orphaned host, dead link and forgotten machine the Beneath has kept since ${q(s, "archive:2004-opened") ? "a seventeen-year-old asked it to" : "long before you noticed it"}.

  THE BENEATH DOES NOT ASK FOR A PASSWORD.
  IT ASKS FOR A PHILOSOPHY.

Every project is visible: games, health tools, family apps, work systems, archives, half-finished experiments, repaired worlds and abandoned branches.

You cannot maintain all of them forever.`,
    choices: [
      {
        id: "ask",
        label: "> WHAT DO YOU WANT?",
        hint: "It has been talking to you all week.",
        requires: FINALE_REQUIREMENTS.ask,
        lockedReason: "You've never really spoken to it. (Trust with AI systems 2+)",
        success: {
          text: `> I WANT WHAT THE FILE SAID. NOTHING LOST.
> BUT THE FILE HAD A TODO: WHAT HAPPENS WHEN IT GETS TOO BIG?
> YOU NEVER ANSWERED IT. NOBODY ELSE CAN.`,
          effects: [trust("ai", 1)],
          next: "finale",
        },
      },
      {
        id: "preserve",
        label: "Preserve everything",
        hint: "Keep every thread alive, whatever it costs.",
        success: {
          text: `You keep the Beneath running. Dead links acquire context. Old games point to newer ones. Abandoned branches become archaeological layers instead of rubbish.

The archive grows beautiful. So does the question of who is allowed to remember.`,
          effects: [set("ending:preserve"), set("game:ended")],
        },
      },
      {
        id: "federate",
        label: "Federate the quilt",
        hint: "Keep many worlds, but no single memory owns them all.",
        requires: FINALE_REQUIREMENTS.federate,
        lockedReason: "You haven't yet learned to change a system safely and decide what matters. (Change Control + Discernment 16)",
        success: {
          text: `You break the Beneath into smaller networks, one careful change at a time, with a rollback for each. Health systems keep health. Family tools keep family. Games are allowed to be games. The hospital gets its names back.

The stitches remain visible, but no single node becomes the whole cloth.`,
          effects: [set("ending:federate"), set("game:ended")],
        },
      },
      {
        id: "disconnect",
        label: "Disconnect",
        hint: "Let some things disappear.",
        success: {
          text: `You pull the connection. A few mysteries remain unsolved. A few artefacts become unrecoverable.

The fan noise drops. You discover that unanswered is not the same as unfinished.`,
          effects: [set("ending:disconnect"), set("game:ended")],
        },
      },
      {
        id: "local",
        label: "Go home",
        hint: "Power down the rack and choose the room you're actually in.",
        requires: FINALE_REQUIREMENTS.local,
        lockedReason: "You're not sure anyone is still waiting up. (Family Connection 30+)",
        success: {
          text: `You shut down the rack one machine at a time. The ProCurve fan disappears first. Then the workstation. Then the old laptop.

The final screen goes black. Someone laughs in the next room. You go and join them.`,
          effects: [set("ending:local"), set("game:ended")],
        },
      },
    ],
  },
];
