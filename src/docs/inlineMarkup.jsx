/**
 * Minimal `**bold**` support for docs copy, so content files can read like
 * prose without pulling in a full markdown/MDX pipeline.
 */
export function renderInline(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}
