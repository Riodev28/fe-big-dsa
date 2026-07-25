export interface AISummarySection {
  heading: string;
  body: string;
}

export function parseAISummarySections(text: string): AISummarySection[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  const sections: AISummarySection[] = [];

  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    const body = (parts[i + 1] ?? '').trim();
    if (heading) sections.push({ heading, body });
  }

  return sections;
}
