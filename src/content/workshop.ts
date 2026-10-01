import { q } from "../engine/engine";
import type { GameState, Storylet } from "../engine/types";
import { attr, journal, meter, set, trust, thread } from "./dsl";

const googleClues = ["clue:other-apps-work", "clue:not-chrome", "clue:not-router", "clue:booster-app"];
const clueCount = (s: GameState) => googleClues.filter((k) => q(s, k) > 0).length;

export const workshop: Storylet[] = [
  {
    id: "ticket-google",
    title: "The Google That Disappeared",
    region: "workshop",
    phases: ["day"],
    once: true,
    priority: 20,
    text: `The Workshop smells of flux and instant coffee. At the front counter, Marg from the bowling club holds out her phone.

"It can't find the internet," she says. "But WhatsApp works. And the weather. Just not Google. Or the bank. Or anything I actually want."

Chrome shows: THIS SITE CAN'T BE REACHED.

Everyone who's touched this phone so far has assumed Chrome is the problem.`,
    choices: [
      {
        id: "watch",
        label: "Watch her use it, without touching anything",
        attention: 1,
        check: { attribute: "watchful", difficulty: 28 },
        success: {
          text: `WhatsApp sends. The weather widget refreshes. Firefox — installed by a nephew in 2028 — fails exactly like Chrome. So it isn't the app, and the phone clearly has a connection.`,
          effects: [set("clue:other-apps-work"), set("clue:not-chrome")],
          next: "ticket-google-layer",
        },
        failure: {
          text: `She taps too fast for you to follow, apologising the whole time. You catch that WhatsApp sends, at least.`,
          effects: [set("clue:other-apps-work")],
          next: "ticket-google-layer",
        },
      },
      {
        id: "ask",
        label: '"Did anything change on it recently?"',
        attention: 1,
        check: { attribute: "persuasive", difficulty: 20 },
        success: {
          text: `"Only the speed thing my grandson put on. It made it ever so fast for a day. Then it stopped." She shows you the icon: a cartoon rocket named BoostDNS PRO. Its website, she adds, "isn't there anymore."`,
          effects: [set("clue:booster-app"), trust("clients", 1)],
          next: "ticket-google-layer",
        },
        failure: {
          text: `"Nothing! I don't touch it!" She is offended on behalf of the phone. You move on.`,
          next: "ticket-google-layer",
        },
      },
      {
        id: "reinstall",
        label: "Reinstall Chrome. It's always Chrome.",
        attention: 2,
        success: {
          text: `Ten minutes of downloading over the Workshop Wi-Fi. Fresh Chrome. THIS SITE CAN'T BE REACHED. At least you've ruled something out — expensively.`,
          effects: [set("clue:not-chrome"), trust("clients", -1)],
          next: "ticket-google-layer",
        },
      },
    ],
  },
  {
    id: "ticket-google-layer",
    title: "Where Is the Failure?",
    region: "workshop",
    phases: ["day"],
    sceneOnly: true,
    text: (s) => {
      const known = [
        q(s, "clue:other-apps-work") && "• Other apps reach the internet.",
        q(s, "clue:not-chrome") && "• Every browser fails the same way.",
        q(s, "clue:not-router") && "• It fails on mobile data too, not just one Wi-Fi.",
        q(s, "clue:booster-app") && "• A 'BoostDNS PRO' app was installed, then its website vanished.",
      ].filter(Boolean);
      return `The visible failure is Chrome. The originating failure could be anywhere underneath it.

APPLICATION → NETWORK → DNS → VPN → ROUTER

What you know:
${known.length ? known.join("\n") : "• Not much yet."}`;
    },
    choices: [
      {
        id: "app",
        label: "It's the application",
        requires: (s) => !q(s, "clue:not-chrome"),
        attention: 1,
        success: {
          text: `You open the same page in Firefox. Same failure. Not the application.`,
          effects: [set("clue:not-chrome")],
          next: "ticket-google-layer",
        },
      },
      {
        id: "network",
        label: "It's the network connection",
        requires: (s) => !q(s, "clue:other-apps-work"),
        attention: 1,
        success: {
          text: `You send yourself a WhatsApp from her phone. It arrives instantly. The connection works — something about finding things doesn't.`,
          effects: [set("clue:other-apps-work")],
          next: "ticket-google-layer",
        },
      },
      {
        id: "router",
        label: "It's the router",
        requires: (s) => !q(s, "clue:not-router"),
        attention: 1,
        success: {
          text: `You switch her to mobile data. Still broken. Whatever this is, she carries it with her. Not the router.`,
          effects: [set("clue:not-router")],
          next: "ticket-google-layer",
        },
      },
      {
        id: "vpn",
        label: "It's a VPN",
        requires: (s) => !q(s, "clue:booster-app"),
        attention: 1,
        success: {
          text: `No VPN profile is active. But in the app drawer, between Solitaire and the bank, sits a cartoon rocket: BoostDNS PRO. Not a VPN. Something that wanted to be in the middle anyway.`,
          effects: [set("clue:booster-app")],
          next: "ticket-google-layer",
        },
      },
      {
        id: "dns-reasoned",
        label: "It's DNS — names aren't resolving",
        hint: "The evidence points here. Now find where.",
        requires: (s) => clueCount(s) >= 2,
        attention: 1,
        success: {
          text: `Settings → Network → Private DNS. It is set to a hostname: fast.boostdns-pro.example.

That hostname no longer exists. Every request to turn a name into an address is being sent to a service that died months ago. Apps with hard-coded addresses still work. Everything that asks "where is Google?" gets silence.

The phone isn't broken. It's asking a ghost for directions.`,
          effects: [set("found:private-dns")],
          next: "ticket-google-fix",
        },
      },
      {
        id: "dns-hunch",
        label: "It's DNS — names aren't resolving",
        hint: "A hunch. Without more evidence you'll be searching blind.",
        requires: (s) => clueCount(s) < 2,
        attention: 1,
        check: { attribute: "watchful", difficulty: 45 },
        success: {
          text: `Settings → Network → Private DNS. It is set to a hostname: fast.boostdns-pro.example.

That hostname no longer exists. Every request to turn a name into an address is being sent to a service that died months ago. Apps with hard-coded addresses still work. Everything that asks "where is Google?" gets silence.

The phone isn't broken. It's asking a ghost for directions.`,
          effects: [set("found:private-dns")],
          next: "ticket-google-fix",
        },
        failure: {
          text: `You're sure it's DNS, but you can't find where. The phone's settings are a labyrinth of vendor menus. You need more to go on.`,
          next: "ticket-google-layer",
        },
      },
      {
        id: "giveup",
        label: "Tell Marg to come back tomorrow",
        hint: "Sometimes the honest answer is 'not today'.",
        success: {
          text: `She takes it well. She's been told worse by people with bigger signs. The phone goes home still asking a ghost for directions.`,
          effects: [trust("clients", -1)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "ticket-google-fix",
    title: "Making It Stay Fixed",
    region: "workshop",
    phases: ["day"],
    sceneOnly: true,
    text: `You know what's wrong. Now: what do you actually do about it, and what does Marg walk out with?`,
    choices: [
      {
        id: "clean",
        label: "Set Private DNS back to Automatic, remove the booster app, and explain why",
        attention: 1,
        success: {
          text: `Google loads. The bank loads. You show Marg the setting and tell her, slowly, that apps promising to make the internet faster usually want to sit between her and it.

"So the internet was fine," she says. "It just couldn't find anything."

That's DNS in one sentence. You might steal it.`,
          effects: [thread(2),
            trust("clients", 2),
            set("lesson:visible-failure"),
            journal("The visible failure is not necessarily the originating failure. (Marg's phone: Chrome looked broken; DNS was the cause.)", "confirmed"),
          ],
          advance: true,
        },
      },
      {
        id: "hardcode",
        label: "Hard-code a public DNS server on her home Wi-Fi and send her off",
        hint: "Quick. Works today.",
        success: {
          text: `Fixed in ninety seconds. Except you fixed her home Wi-Fi, not the phone. The booster's dead setting is still there, waiting for the next network she joins.`,
          effects: [thread(2), meter("techDebt", 1), set("debt:marg-dns"), set("lesson:visible-failure"), journal("Marg's phone: patched around a dead Private DNS setting rather than removing it.", "confirmed")],
          advance: true,
        },
      },
      {
        id: "reset",
        label: "Factory reset. Clean slate.",
        energy: 2,
        success: {
          text: `It works, eventually. Marg spends the afternoon at the counter re-logging into everything. She'd backed up her photos, mostly. "Mostly," she says, at intervals.`,
          effects: [trust("clients", -1), attr("practical", 1)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "bench-queue",
    title: "The Bench Queue",
    region: "workshop",
    phases: ["day"],
    text: `Three laptops, one printer, and a sticky note that just says "WIFI???". Routine work. Honest money.`,
    choices: [
      {
        id: "grind",
        label: "Clear the queue",
        attention: 2,
        energy: 1,
        check: { attribute: "practical", difficulty: 26 },
        success: {
          text: `Driver, cable, password reset, paper jam. The queue empties. Colleagues notice.`,
          effects: [trust("colleagues", 1), meter("systemStability", 3)],
          advance: true,
        },
        failure: {
          text: `The printer wins. Printers always eventually win.`,
          effects: [meter("noise", 1)],
          advance: true,
        },
      },
      {
        id: "why",
        label: 'Ask what "WIFI???" actually means before touching anything',
        attention: 1,
        success: {
          text: `It means the receptionist's laptop can't see the office network after an update, but only on Tuesdays, when the cleaner unplugs the access point to vacuum. The fix is a cable tie. The skill was asking.`,
          effects: [thread(38), attr("discernment", 1), trust("colleagues", 1)],
          advance: true,
        },
      },
    ],
  },
];
