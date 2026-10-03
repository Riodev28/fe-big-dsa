import { cn } from '@/lib/utils';
import { ComplexityClassInfo, Severity } from '@/types/dto';

const SEVERITY_STYLES: Record<Severity, string> = {
  good: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  warning: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
};

interface ComplexityBadgeProps {
  notation: string;
  complexityClass: ComplexityClassInfo;
  className?: string;
}

export default function ComplexityBadge({ notation, complexityClass, className }: ComplexityBadgeProps) {
  return (
    <span
      title={`${complexityClass.label} growth`}
      className={cn(
        'inline-block rounded border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide',
        SEVERITY_STYLES[complexityClass.severity],
        className
      )}
    >
      {notation}
    </span>
  );
}
