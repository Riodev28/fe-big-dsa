import Dashboard from '@/components/analytics/dashboard';
import { DEFAULT_ANALYSIS_KIND, parseAnalysisKind } from '@/lib/analytics';

interface HomePageProps {
  searchParams: Promise<{ kind?: string | string[] }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { kind } = await searchParams;

  return <Dashboard kind={parseAnalysisKind(kind) ?? DEFAULT_ANALYSIS_KIND} />;
}
