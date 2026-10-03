import AnalysesList from '@/components/analytics/analyses-list';
import { parseAnalysisKind, parsePage } from '@/lib/analytics';

interface AnalysesPageProps {
  searchParams: Promise<{ kind?: string | string[]; page?: string | string[] }>;
}

export default async function AnalysesPage({ searchParams }: AnalysesPageProps) {
  const { kind, page } = await searchParams;

  return <AnalysesList kind={parseAnalysisKind(kind)} page={parsePage(page)} />;
}
