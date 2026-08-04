"use client";

import { useMode } from "@/lib/use-mode";
import { GameHome } from "./game-home";
import { FormalHome } from "./formal-home";
import type { HomeData } from "./types";

export function HomeContent(data: HomeData) {
  const mode = useMode();
  return mode === "game" ? <GameHome {...data} /> : <FormalHome {...data} />;
}
