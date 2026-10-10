// Which chapter the URL's #hash points at (the cover when it matches none).
export const chapterFromHash = (chapters) =>
  Math.max(0, chapters.findIndex((c) => `#${c.id}` === window.location.hash))
