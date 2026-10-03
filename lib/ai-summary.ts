export interface AISummarySection {
  /** Empty for text the model wrote without a bold heading */
  heading: string;
  body: string;
}

function toParagraphs(text: string): AISummarySection[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((body) => ({ heading: '', body }));
}

export function parseAISummarySections(text: string): AISummarySection[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  // Text before the first bold heading (or all of it, when the model used none)
  const sections: AISummarySection[] = toParagraphs(parts[0]);

  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    const body = (parts[i + 1] ?? '').trim();
    if (heading) sections.push({ heading, body });
  }

  return sections;
}
