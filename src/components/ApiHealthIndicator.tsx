import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

export function ApiHealthIndicator() {
  const { data: health, isError } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 15000, // 15 segons
    retry: 1,
  });

  const isOnline = health?.status === 'ok' && !isError;

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`w-2 h-2 rounded-full transition-colors ${
          isOnline ? 'bg-online' : 'bg-offline'
        }`}
      />
      <Badge 
        className={
          isOnline 
            ? 'bg-success text-success-foreground hover:bg-success/80' 
            : 'bg-error text-error-foreground hover:bg-error/80'
        }
      >
        {isOnline ? 'API en línia' : 'API fora de línia'}
      </Badge>
    </div>
  );
}