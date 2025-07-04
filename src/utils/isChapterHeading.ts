export const isChapterHeading = (para: string): boolean => {
  const trimmed = para.trim();

  if (!trimmed) return false;

  if (trimmed.startsWith("CHAPTER_")) return true;
  if (trimmed.startsWith("<h2")) return true;

  return false;
};
