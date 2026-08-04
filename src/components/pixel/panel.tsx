import type { ReactNode } from "react";

/**
 * The core "game UI box". `title` renders a label tab on the top border,
 * the way stat windows are framed in 8-bit RPGs.
 */
export function Panel({
  title,
  accent = "text-foreground",
  className = "",
  children,
}: {
  title?: string;
  accent?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`pixel-panel relative ${title ? "pt-7" : ""} ${className}`}>
      {title && (
        <span
          className={`font-pixel absolute -top-3 left-4 bg-panel px-2 text-[10px] ${accent}`}
        >
          {title}
        </span>
      )}
      {children}
    </div>
  );
}

/** Section heading with a blinking prompt marker. */
export function SectionTitle({
  children,
  accent = "text-magic",
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <h2 className="font-pixel mb-6 flex items-center gap-3 text-sm sm:text-base">
      <span className={`${accent} blink`}>▶</span>
      {children}
    </h2>
  );
}
