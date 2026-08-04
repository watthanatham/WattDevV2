"use client";

import { useSyncExternalStore } from "react";
import { useMode } from "@/lib/use-mode";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mode = useMode();

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title={isDark ? "Light mode" : "Dark mode"}
      className={
        mode === "game"
          ? "pixel-panel-sm flex size-9 items-center justify-center transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          : "flex size-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      }
    >
      <span className={mode === "game" ? "font-pixel text-[10px]" : "text-sm"}>
        {isDark ? "☾" : "☀"}
      </span>
    </button>
  );
}
