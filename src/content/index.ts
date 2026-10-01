import { indexStorylets } from "../engine/engine";
import type { Storylet } from "../engine/types";
import { city } from "./city";
import { dadlan } from "./dadlan";
import { home } from "./home";
import { night } from "./night";
import { workshop } from "./workshop";

export const ALL_STORYLETS: Storylet[] = [...home, ...workshop, ...city, ...dadlan, ...night];
export const STORYLETS = indexStorylets(ALL_STORYLETS);
