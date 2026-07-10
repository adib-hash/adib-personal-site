import { useEffect } from "react";

export const SITE_TITLE = "Adib Choudhury";
export const SITE_DESCRIPTION =
  "A place for sharing my thoughts and side projects while exploring tech, business, and spirituality.";

export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title || SITE_TITLE;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description || SITE_DESCRIPTION);

    return () => {
      document.title = SITE_TITLE;
      meta.setAttribute("content", SITE_DESCRIPTION);
    };
  }, [title, description]);

  return null;
}
