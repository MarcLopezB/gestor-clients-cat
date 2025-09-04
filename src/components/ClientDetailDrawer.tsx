import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from './StatusBadge';
import { NatBadge } from './NatBadge';

interface ClientDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  externalId: string | null;
}

export function ClientDetailDrawer({ isOpen, onClose, externalId }: ClientDetailDrawerProps) {
  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', externalId],
    queryFn: () => apiClient.getClient(externalId!),
    enabled: !!externalId && isOpen,
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ca });
    } catch {
      return dateString;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Detall del Client</SheetTitle>
              <SheetDescription>
                {externalId ? `ID: ${externalId}` : 'Informació detallada'}
              </SheetDescription>
            </div>
            <SheetClose asChild>
              <button className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <X className="h-4 w-4" />
                <span className="sr-only">Tancar</span>
              </button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-error">
              <p>No s'ha pogut carregar el client</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Error desconegut'}
              </p>
            </div>
          ) : client ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <DetailItem 
                  label="External ID" 
                  value={client.external_id || '—'} 
                />
                
                <DetailItem 
                  label="Serial" 
                  value={client.serial || '—'} 
                />
                
                <DetailItem 
                  label="Telèfon" 
                  value={client.phone || '—'} 
                />
                
                <DetailItem 
                  label="Domicili" 
                  value={client.domicilio_to || '—'} 
                />
                
                <DetailItem 
                  label="Velocitat" 
                  value={client.velocidad_label || '—'} 
                />
                
                <DetailItem 
                  label="Perfil de Servei" 
                  value={client.service_profile || '—'} 
                />
                
                <DetailItem 
                  label="Service ID" 
                  value={client.service_id || '—'} 
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">És NAT</label>
                  <div>
                    <NatBadge esNat={client.es_nat} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estat</label>
                  <div>
                    <StatusBadge status={client.estado} />
                  </div>
                </div>
                
                <DetailItem 
                  label="Missatge" 
                  value={client.mensaje || '—'} 
                />
                
                <DetailItem 
                  label="Data" 
                  value={formatDate(client.fecha)} 
                />
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="text-sm bg-muted p-2 rounded-md">
        {value}
      </div>
    </div>
  );
}