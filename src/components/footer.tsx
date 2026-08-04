"use client";

import { useMode } from "@/lib/use-mode";

export function Footer() {
  const mode = useMode();
  const year = new Date().getFullYear();

  if (mode === "game") {
    return (
      <footer className="border-t-[3px] border-panel-border bg-panel py-6">
        <p className="font-pixel text-center text-[9px] leading-loose text-muted">
          &copy; {year} WATT.DEV
          <br />
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-black">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        &copy; {year} Watthanatham Kruram
      </p>
    </footer>
  );
}
