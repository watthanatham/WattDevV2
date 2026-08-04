"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { ModeToggle } from "./mode-toggle";
import { useMode } from "@/lib/use-mode";

const links = [
  { href: "/", labelGame: "HOME", labelFormal: "Home" },
  { href: "/blog", labelGame: "BLOG", labelFormal: "Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const mode = useMode();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (mode === "game") {
    return (
      <header className="sticky top-0 z-40 border-b-[3px] border-panel-border bg-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/" className="font-pixel text-sm">
            WATT<span className="text-magic">.</span>DEV
          </Link>

          <nav className="hidden items-center gap-2 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-pixel px-3 py-2 text-[10px] transition-colors ${
                  isActive(link.href)
                    ? "bg-magic text-white"
                    : "hover:bg-foreground/10"
                }`}
              >
                {isActive(link.href) && <span className="mr-1.5">▸</span>}
                {link.labelGame}
              </Link>
            ))}
            <ModeToggle />
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 sm:hidden">
            <ModeToggle />
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="pixel-panel-sm flex size-9 items-center justify-center"
            >
              <span className="font-pixel text-[10px]">{open ? "×" : "≡"}</span>
            </button>
          </div>
        </div>

        {open && (
          <nav className="flex flex-col border-t-[3px] border-panel-border sm:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-pixel border-b border-panel-border/30 px-5 py-3 text-[10px] last:border-b-0"
              >
                {link.labelGame}
              </Link>
            ))}
          </nav>
        )}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="text-base font-bold tracking-tight">
          WATT.DEV
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {link.labelFormal}
            </Link>
          ))}
          <ModeToggle />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <ModeToggle />
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex size-9 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-zinc-200 px-5 py-3 sm:hidden dark:border-zinc-800">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {link.labelFormal}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
