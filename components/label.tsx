import { cn } from '@/lib/utils';
import { FC } from 'react';

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}
const Label: FC<LabelProps> = ({ children, className }) => {
  return (
    <label className={cn('font-bold text-lg', className)}>{children}</label>
  );
};

export default Label;
