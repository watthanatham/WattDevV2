"use client";

import { useSyncExternalStore } from "react";

export type SiteMode = "formal" | "game";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-mode"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): SiteMode {
  return document.documentElement.dataset.mode === "game" ? "game" : "formal";
}

/** Matches the server-rendered default (formal), so hydration never mismatches. */
function getServerSnapshot(): SiteMode {
  return "formal";
}

export function useMode(): SiteMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setMode(mode: SiteMode) {
  document.documentElement.dataset.mode = mode;
  localStorage.setItem("mode", mode);
}
