import { useState } from 'react';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { Eye, Play, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from './StatusBadge';
import { NatBadge } from './NatBadge';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { Client, ClientsQuery } from '@/types/client';

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
  total: number;
  filters: ClientsQuery;
  onFiltersChange: (filters: ClientsQuery) => void;
  onViewDetail: (externalId: string) => void;
  selectedClients: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function ClientsTable({
  clients,
  isLoading,
  error,
  total,
  filters,
  onFiltersChange,
  onViewDetail,
  selectedClients,
  onSelectionChange,
}: ClientsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const processClientMutation = useMutation({
    mutationFn: (externalId: string) => apiClient.processClient(externalId),
    onSuccess: (data) => {
      toast({
        title: 'Processament iniciat',
        description: `Processament iniciat per ${data.external_id}`,
      });
      // Refrescar les dades
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error de processament',
        description: error.message || 'No s\'ha pogut processar el client',
        variant: 'destructive',
      });
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ca });
    } catch {
      return dateString;
    }
  };

  const truncateMessage = (message: string | null, maxLength = 50) => {
    if (!message) return '—';
    return message.length > maxLength 
      ? `${message.substring(0, maxLength)}...` 
      : message;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = clients
        .filter(c => c.external_id)
        .map(c => c.external_id as string);
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectClient = (externalId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedClients, externalId]);
    } else {
      onSelectionChange(selectedClients.filter(id => id !== externalId));
    }
  };

  const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 25)) + 1;
  const totalPages = Math.ceil(total / (filters.limit || 25));

  const handlePrevPage = () => {
    const newOffset = Math.max(0, (filters.offset || 0) - (filters.limit || 25));
    onFiltersChange({ ...filters, offset: newOffset });
  };

  const handleNextPage = () => {
    const newOffset = (filters.offset || 0) + (filters.limit || 25);
    if (newOffset < total) {
      onFiltersChange({ ...filters, offset: newOffset });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                {['External ID', 'Serial', 'Telèfon', 'Velocitat', 'Perfil', 'NAT', 'Service ID', 'Estat', 'Missatge', 'Data', 'Accions'].map((header) => (
                  <TableHead key={header}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-error text-lg">Error de connexió</p>
        <p className="text-muted-foreground mt-2">
          {error.message || 'No s\'han pogut carregar els clients'}
        </p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">No s'han trobat clients</p>
        <p className="text-muted-foreground mt-2">
          Prova a canviar els filtres de cerca
        </p>
      </div>
    );
  }

  const isAllSelected = clients.length > 0 && 
    clients.every(c => !c.external_id || selectedClients.includes(c.external_id));
  const isSomeSelected = selectedClients.length > 0 && !isAllSelected;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected || isSomeSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>External ID</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Telèfon</TableHead>
              <TableHead>Velocitat</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>NAT</TableHead>
              <TableHead>Service ID</TableHead>
              <TableHead>Estat</TableHead>
              <TableHead>Missatge</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-20">Accions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow key={`${client.external_id}-${index}`}>
                <TableCell>
                  {client.external_id && (
                    <Checkbox
                      checked={selectedClients.includes(client.external_id)}
                      onCheckedChange={(checked) => 
                        handleSelectClient(client.external_id!, checked as boolean)
                      }
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {client.external_id || '—'}
                </TableCell>
                <TableCell>{client.serial || '—'}</TableCell>
                <TableCell>{client.phone || '—'}</TableCell>
                <TableCell>{client.velocidad_label || '—'}</TableCell>
                <TableCell>{client.service_profile || '—'}</TableCell>
                <TableCell>
                  <NatBadge esNat={client.es_nat} />
                </TableCell>
                <TableCell>{client.service_id || '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={client.estado} />
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-help">
                          {truncateMessage(client.mensaje)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{client.mensaje || 'Sense missatge'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{formatDate(client.fecha)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Accions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => client.external_id && onViewDetail(client.external_id)}
                        disabled={!client.external_id}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Veure detall
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => client.external_id && processClientMutation.mutate(client.external_id)}
                        disabled={!client.external_id || processClientMutation.isPending}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Processar ara
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginació */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Pàgina {currentPage} de {totalPages} ({total} clients total)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            Següent
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}