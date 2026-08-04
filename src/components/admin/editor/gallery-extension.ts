import { Node, mergeAttributes } from "@tiptap/core";

export type GalleryImage = { src: string; alt: string };

/**
 * A block node holding several images rendered as a responsive grid — for photo
 * sets shown side by side. Stored as `<div data-gallery>` with real <img>
 * children so the HTML is self-describing (the reader needs no JS to show it).
 * It's an atom: inserted and deleted as one unit, reorderable via the drag
 * handle. Per-image editing isn't supported (delete + re-insert to change).
 */
export const ImageGallery = Node.create({
  name: "imageGallery",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      images: {
        default: [] as GalleryImage[],
        parseHTML: (el) =>
          Array.from(el.querySelectorAll("img")).map((img) => ({
            src: img.getAttribute("src") ?? "",
            alt: img.getAttribute("alt") ?? "",
          })),
        // Rendered as child <img> nodes in renderHTML, not as an attribute.
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-gallery]" }];
  },

  renderHTML({ node }) {
    const images = (node.attrs.images as GalleryImage[]) ?? [];
    return [
      "div",
      mergeAttributes({ "data-gallery": "" }),
      ...images.map((im) => ["img", { src: im.src, alt: im.alt }]),
    ];
  },
});
