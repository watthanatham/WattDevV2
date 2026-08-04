"use client";

import { useMode, setMode } from "@/lib/use-mode";

export function ModeToggle() {
  const mode = useMode();
  const isGame = mode === "game";

  function toggle() {
    setMode(isGame ? "formal" : "game");
  }

  return (
    <button
      onClick={toggle}
      title={isGame ? "Switch to formal mode" : "Switch to 8-bit mode"}
      className={
        isGame
          ? "pixel-btn bg-xp px-3 py-2 text-[9px] text-[#2e2205]"
          : "inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3.5 py-2 text-xs font-medium text-zinc-600 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700 dark:text-zinc-300"
      }
    >
      {isGame ? (
        <>💼 FORMAL MODE</>
      ) : (
        <>🕹️ INSERT COIN</>
      )}
    </button>
  );
}
