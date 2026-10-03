import AnalysisDetail from '@/components/analytics/analysis-detail';

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;

  // Keying by id resets the fetched state when navigating between analyses
  return <AnalysisDetail key={id} id={id} />;
}
