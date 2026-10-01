import type { GameState, Machine } from "./types";

const STARTING_MACHINES: Machine[] = [
  {
    id: "probook",
    name: "ProBook x360",
    role: "High-performance mobile workstation",
    traits: ["FAST", "HOT", "CAPABLE", "OVERCONFIDENT COOLING SYSTEM"],
    storage: "512 GB NVMe",
    os: "Windows 11",
    reliability: 70,
    port: "DadLAN core",
  },
  {
    id: "thinkpad",
    name: "Old ThinkPad",
    role: "Veteran support unit",
    traits: ["DURABLE", "SLOW", "LEGACY COMPATIBILITY", "UNKNOWN HISTORY"],
    storage: "250 GB HDD",
    os: "Windows 10",
    reliability: 80,
    port: "DadLAN core",
  },
  {
    id: "toshiba",
    name: "Toshiba Satellite",
    role: "Recovered machine",
    traits: ["UNRELIABLE RELIC"],
    storage: "500 GB HDD (clicking)",
    os: "Windows 10",
    reliability: 30,
    port: "Shelf",
  },
  {
    id: "laptop06",
    name: "Laptop 06",
    role: "LAN party regular",
    traits: ["CHEERFUL", "FLICKERS UNDER STEAM"],
    storage: "256 GB SSD",
    os: "Windows 10",
    reliability: 55,
    port: "DadLAN core",
  },
];

export function newGame(seed: number, name = "The Keeper"): GameState {
  return {
    version: 1,
    seed,
    rngState: seed | 0,
    name,
    day: 1,
    phase: "morning",
    nightActions: 0,
    attributes: {
      watchful: 30,
      practical: 30,
      persuasive: 22,
      steady: 20,
      curious: 34,
      discernment: 12,
    },
    meters: {
      energy: 7,
      attention: DAILY_ATTENTION,
      sleepDebt: 0,
      familyConnection: 10,
      systemStability: 50,
      techDebt: 0,
      noise: 3,
    },
    trust: { family: 5, colleagues: 3, clients: 3, institutions: 2, ai: 0 },
    qualities: {},
    machines: Object.fromEntries(STARTING_MACHINES.map((m) => [m.id, { ...m, traits: [...m.traits] }])),
    familyMoments: [],
    journal: [],
    current: null,
    lastOutcome: null,
    ended: false,
  };
}

export const DAILY_ATTENTION = 8;
export const MAX_ENERGY = 10;
