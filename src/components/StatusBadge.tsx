import { Badge } from '@/components/ui/badge';
import type { ClientStatus } from '@/types/client';

interface StatusBadgeProps {
  status: ClientStatus | null;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) {
    return <Badge variant="secondary" className={className}>—</Badge>;
  }

  const variants = {
    OK: 'bg-success text-success-foreground hover:bg-success/80',
    ERROR: 'bg-error text-error-foreground hover:bg-error/80',
    EXCEPTION: 'bg-warning text-warning-foreground hover:bg-warning/80',
  };

  return (
    <Badge className={`${variants[status]} ${className || ''}`}>
      {status}
    </Badge>
  );
}