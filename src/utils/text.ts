export const getPreview = (markdown: string, length = 100) => {
  // Remove markdown syntax
  const text = markdown
    .replace(/!\[(.*?)\]\(.*?\)/g, "")     // remove images first
    .replace(/[#_*`>~-]/g, "")             // strip basic markdown chars
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")    // links: [text](url) → text
    .replace(/\n+/g, " ")                  // collapse newlines
    .trim();                               // trim whitespace

  return text.length > length
    ? text.slice(0, length) + "…"
    : text;
};

