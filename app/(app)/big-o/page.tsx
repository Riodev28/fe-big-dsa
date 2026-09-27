import BigOAnalyzer from '@/components/big-o-analyzer';

interface BigOPageProps {
  searchParams: Promise<{ file?: string | string[] }>;
}

export default async function BigOPage({ searchParams }: BigOPageProps) {
  const { file } = await searchParams;
  const fileId = typeof file === 'string' ? file : undefined;

  // Keying by file id remounts the analyzer, so switching files never leaks editor or analysis state.
  return <BigOAnalyzer key={fileId ?? 'new'} fileId={fileId} />;
}
