/** Shared blog constants + helpers used by both reader and admin. */

export const BLOG_CATEGORIES = [
  { value: "Street", label: "Street" },
  { value: "Portrait", label: "Portrait" },
  { value: "Fashion", label: "Fashion" },
  { value: "General", label: "General" },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]["value"];

export function categoryLabel(value: string): string {
  return BLOG_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/**
 * Rough reading time in minutes from the post's HTML body. Strips tags so
 * image URLs / markup don't inflate the count, then counts words at 200 wpm.
 */
export function readingTimeMinutes(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
