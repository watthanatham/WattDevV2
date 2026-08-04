import Image from "@tiptap/extension-image";

/**
 * Image node extended with a `width` attribute (normal | wide | full) so the
 * writer can control how large a photo renders. Serialized as `data-width` and
 * read back on the reader side to apply the matching CSS width.
 */
export const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "normal",
        parseHTML: (el) => el.getAttribute("data-width") || "normal",
        renderHTML: (attrs) =>
          attrs.width ? { "data-width": attrs.width } : {},
      },
    };
  },
}).configure({ inline: false, allowBase64: false });
