import { indexStorylets } from "../engine/engine";
import type { Storylet } from "../engine/types";
import { archive } from "./archive";
import { chapter2 } from "./chapter2";
import { city } from "./city";
import { consequences } from "./consequences";
import { dadlan } from "./dadlan";
import { finale } from "./finale";
import { home } from "./home";
import { night } from "./night";
import { workshop } from "./workshop";

export const ALL_STORYLETS: Storylet[] = [
  ...home,
  ...workshop,
  ...city,
  ...dadlan,
  ...night,
  ...consequences,
  ...archive,
  ...chapter2,
  ...finale,
];
export const STORYLETS = indexStorylets(ALL_STORYLETS);
