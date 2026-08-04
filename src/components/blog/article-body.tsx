"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders the post's HTML body (already sanitized on the server) with clean
 * editorial typography. Images are wrapped in captioned figures, sized by their
 * data-width attribute, and open in a lightbox on click.
 */
export function ArticleBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  // Post-process: wrap images in <figure> + caption, mark them zoomable.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("img").forEach((img) => {
      if (img.closest("figure")) return;
      // Gallery images stay in their grid (still clickable for the lightbox);
      // don't wrap them into full-width figures.
      if (img.closest("[data-gallery]")) {
        img.classList.add("cursor-zoom-in");
        img.loading = "lazy";
        return;
      }
      img.classList.add("cursor-zoom-in");
      img.loading = "lazy";
      const fig = document.createElement("figure");
      const width = img.getAttribute("data-width") || "normal";
      fig.setAttribute("data-width", width);
      img.replaceWith(fig);
      fig.appendChild(img);
      const alt = img.getAttribute("alt");
      if (alt) {
        const cap = document.createElement("figcaption");
        cap.textContent = alt;
        fig.appendChild(cap);
      }
    });
  }, [html]);

  // Event-delegated lightbox
  function onClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      setLightbox({ src: img.src, alt: img.alt });
    }
  }

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <>
      <div
        ref={ref}
        className="blog-prose"
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-5 top-5 text-3xl leading-none text-white/70 transition hover:text-white"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
