import Link from "next/link";
import type { ReactNode } from "react";

const VARIANTS = {
  primary: "bg-magic text-white",
  hp: "bg-hp text-[#0a2412]",
  xp: "bg-xp text-[#2e2205]",
  ghost: "bg-panel text-foreground",
} as const;

type Variant = keyof typeof VARIANTS;

export function PixelLink({
  href,
  variant = "primary",
  external = false,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = `pixel-btn px-4 py-2.5 text-[10px] ${VARIANTS[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
