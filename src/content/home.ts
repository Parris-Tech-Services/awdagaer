import { q } from "../engine/engine";
import type { Storylet } from "../engine/types";
import { attr, family, journal, meter, quality, set, trust } from "./dsl";

export const home: Storylet[] = [
  {
    id: "wake-day1",
    title: "The House Wakes in the Wrong Order",
    region: "home",
    phases: ["morning"],
    once: true,
    priority: 100,
    requires: (s) => s.day === 1,
    text: `Dubbo, 2031. Six-forty, and the house is already running ahead of you.

The kettle is on. Someone has taken the good charger. Your phone shows eleven notifications, three of which are about other notifications.

From the kitchen: "Google's broken again." Your partner holds up a phone as if it has personally betrayed them. Behind them, the family calendar has a note in a child's handwriting — CAMP FRIDAY — MOZZIES?? — underlined twice.

A Workshop ticket arrives at the same moment: a client's phone "can't find the internet but WhatsApp works". And somewhere in the router cupboard, a fan you don't remember installing is whining in a key you don't like.`,
    choices: [
      {
        id: "router",
        label: "Go straight to the router cupboard",
        hint: "Something is whining. You want to know what.",
        attention: 1,
        check: { attribute: "watchful", difficulty: 25 },
        success: {
          text: `The whine is the old D-Link smart switch, its fan clogged with a year of lint. More interesting: the router's client list has one more device than you own. It is listed only as a string of hex and the word NEATH.

You write it down. It is probably the kids' new tablet. Probably.`,
          effects: [set("clue:unknown-device"), journal("Router lists an unrecognised client labelled NEATH.", "unverified"), meter("noise", 1)],
          advance: true,
        },
        failure: {
          text: `You stare at blinking lights until the toast burns. Whatever is whining keeps its secret. Your partner makes their own breakfast and the phone stays broken.`,
          effects: [trust("family", -1), meter("noise", 1)],
          advance: true,
        },
      },
      {
        id: "breakfast",
        label: "Make breakfast and ask who needs what",
        hint: "The cupboard will still be there in an hour.",
        success: {
          text: `Toast, a negotiation about Vegemite, and a proper look at the calendar. Camp is Friday. The kids need insect repellent — "the good kind, not the one that smells like a candle."

Your partner's phone, it turns out, only fails on home Wi-Fi. That is useful. That is a clue you got by asking a person instead of a device.`,
          effects: [family("breakfast", 4), set("clue:home-wifi-only"), set("quest:repellent"), trust("family", 1)],
          advance: true,
        },
      },
      {
        id: "scroll",
        label: "Read every notification before getting up",
        hint: "Triage. Totally triage.",
        success: {
          text: `Eleven notifications become nineteen. You learn that a game you haven't played in four years has updated its terms of service. You learn nothing about Google. By the time you get up, the kitchen has emptied.`,
          effects: [meter("attention", -1), meter("noise", 2)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "breakfast-bench",
    title: "Breakfast at the Bench",
    region: "home",
    phases: ["morning"],
    requires: (s) => s.day > 1,
    text: (s) =>
      `Morning light across the bench. ${
        s.meters.familyConnection >= 20
          ? "The kids are talking over each other, which is how you know it's a good day."
          : "Everyone eats in parallel, each behind their own screen."
      } Your phone buzzes face-down.`,
    choices: [
      {
        id: "sit",
        label: "Sit down with them. Phone stays face-down.",
        success: {
          text: `Twelve minutes of unscheduled conversation about whether sharks have bones. They don't, apparently. You'll remember this longer than whatever the phone wanted.`,
          effects: [family("breakfast", 3), meter("noise", -1)],
          advance: true,
        },
      },
      {
        id: "alerts",
        label: "Check the overnight alerts",
        hint: "Stay ahead of the day.",
        check: { attribute: "watchful", difficulty: 28 },
        success: {
          text: `You catch a failing disk warning on the cache node before it becomes a problem. Smug, you pocket the phone.`,
          effects: [meter("systemStability", 5), meter("noise", 1)],
          advance: true,
        },
        failure: {
          text: `Forty alerts, thirty-nine of them noise, and you can't find the one that matters. Breakfast happens around you.`,
          effects: [meter("noise", 2)],
          advance: true,
        },
      },
      {
        id: "walk",
        label: "Take a short walk before the day starts",
        success: {
          text: `Ten minutes along the street. Galahs, cut grass, a neighbour's sprinkler. Your breathing slows to match your feet.`,
          effects: [meter("energy", 1), meter("noise", -1)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "read-to-kids",
    title: "Bedtime Story",
    region: "home",
    phases: ["evening"],
    text: (s) =>
      `The youngest is holding a book out at arm's length like a summons. ${
        q(s, "dadlan:busy") ? "Through the wall, you can hear the DadLAN rack humming, waiting for you." : ""
      }`,
    choices: [
      {
        id: "present",
        label: "Read properly. Phone in the other room.",
        attention: 1,
        success: {
          text: `You do the voices. All of them, including the grumpy wombat. Halfway through, a small head lands on your shoulder. You finish the chapter anyway, quieter.`,
          effects: [family("reading", 5), meter("noise", -1), trust("family", 1)],
          advance: true,
        },
      },
      {
        id: "half",
        label: "Read, while keeping an eye on a progress bar",
        hint: "It's only a quick download.",
        success: {
          text: `You read the words. You also read "87% — 4 minutes remaining" eleven times. "You skipped a page," says a small voice. You had.`,
          effects: [family("reading", 2), meter("noise", 1)],
          advance: true,
        },
      },
      {
        id: "pass",
        label: "Ask your partner to do it tonight",
        hint: "There's a lot on.",
        success: {
          text: `They do it, without comment. The comment arrives later, in a different form.`,
          effects: [trust("family", -1), quality("evening:freed")],
        },
      },
    ],
  },
  {
    id: "partner-talk",
    title: "The Couch, After",
    region: "home",
    phases: ["evening"],
    requires: (s) => s.day >= 2,
    once: true,
    text: `The kids are down. Your partner is on the couch with the expression of someone deciding whether to say something.

"You were in the cupboard until one last night," they say. "I'm not asking you to stop. I'm asking what you're actually trying to finish."`,
    choices: [
      {
        id: "honest",
        label: '"I don\'t know. That\'s sort of the problem."',
        check: { attribute: "steady", difficulty: 26 },
        success: {
          text: `You say it without defending yourself, which is harder than it sounds. They nod slowly. "Okay. Then maybe we work out what 'finished' looks like. Together." It isn't a solution. It is the first time this week anyone has asked the right question.`,
          effects: [attr("discernment", 1), trust("family", 2), family("talk", 5)],
        },
        failure: {
          text: `You start with "I don't know" and drift, without meaning to, into a twelve-minute explanation of DNS forwarding. Their eyes glaze kindly. "That's not what I asked," they say, and go to bed.`,
          effects: [trust("family", -1), meter("noise", 1)],
        },
      },
      {
        id: "list",
        label: "List everything that's broken",
        success: {
          text: `It's a long list. By the end of it you're both tired, and the list is longer than when you started, because saying it out loud reminded you of three more things.`,
          effects: [meter("noise", 2), meter("energy", -1)],
        },
      },
    ],
  },
];
