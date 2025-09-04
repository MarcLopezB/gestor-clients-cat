import { Badge } from '@/components/ui/badge';

interface NatBadgeProps {
  esNat: 0 | 1 | null;
  className?: string;
}

export function NatBadge({ esNat, className }: NatBadgeProps) {
  if (esNat === null) {
    return <Badge variant="secondary" className={className}>—</Badge>;
  }

  if (esNat === 1) {
    return (
      <Badge className={`bg-nat text-nat-foreground hover:bg-nat/80 ${className || ''}`}>
        NAT
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={className}>
      NoNAT
    </Badge>
  );
}