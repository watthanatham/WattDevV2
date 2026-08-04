import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Server-side HTML sanitizer for post bodies authored in the Tiptap editor.
 * Uses sanitize-html (pure JS, no jsdom) so it runs safely inside the Next.js
 * server renderer. Allows only the tags/attributes the editor can produce.
 */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "hr",
      "h2",
      "h3",
      "strong",
      "b",
      "em",
      "i",
      "s",
      "u",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "figure",
      "figcaption",
      "div",
      "code",
      "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "data-width"],
      figure: ["data-width"],
      // Only the gallery marker is kept on <div>; everything else is stripped.
      div: ["data-gallery"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}
