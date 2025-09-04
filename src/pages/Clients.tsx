import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { AppHeader } from '@/components/AppHeader';
import { StatsCards } from '@/components/StatsCards';
import { ClientsFilters } from '@/components/ClientsFilters';
import { MassActionsBar } from '@/components/MassActionsBar';
import { ClientsTable } from '@/components/ClientsTable';
import { ClientDetailDrawer } from '@/components/ClientDetailDrawer';
import type { ClientsQuery } from '@/types/client';

const DEFAULT_FILTERS: ClientsQuery = {
  limit: 25,
  offset: 0,
  order: 'fecha_desc',
};

export default function Clients() {
  const [filters, setFilters] = useState<ClientsQuery>(DEFAULT_FILTERS);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [detailDrawer, setDetailDrawer] = useState<{
    isOpen: boolean;
    externalId: string | null;
  }>({ isOpen: false, externalId: null });

  const {
    data: clientsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['clients', filters],
    queryFn: () => apiClient.getClients(filters),
    refetchInterval: autoRefresh ? 30000 : false, // 30 segons
  });

  const handleFiltersChange = (newFilters: ClientsQuery) => {
    setFilters(newFilters);
    // Clear selection when filters change
    setSelectedClients([]);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSelectedClients([]);
  };

  const handleViewDetail = (externalId: string) => {
    setDetailDrawer({ isOpen: true, externalId });
  };

  const handleCloseDetail = () => {
    setDetailDrawer({ isOpen: false, externalId: null });
  };

  const handleRefresh = () => {
    refetch();
  };

  const clients = clientsData?.items || [];
  const total = clientsData?.total || 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onRefresh={handleRefresh} isRefreshing={isFetching} />
      
      <main className="container mx-auto py-6 space-y-6">
        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh">
              Auto-actualitza cada 30s
            </Label>
          </div>
        </div>

        {/* Estadístiques */}
        {clients.length > 0 && <StatsCards clients={clients} />}

        {/* Filtres */}
        <ClientsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Accions massives */}
        <MassActionsBar
          selectedClients={selectedClients}
          onClearSelection={() => setSelectedClients([])}
        />

        {/* Taula */}
        <ClientsTable
          clients={clients}
          isLoading={isLoading}
          error={error}
          total={total}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onViewDetail={handleViewDetail}
          selectedClients={selectedClients}
          onSelectionChange={setSelectedClients}
        />
      </main>

      {/* Drawer de detalls */}
      <ClientDetailDrawer
        isOpen={detailDrawer.isOpen}
        onClose={handleCloseDetail}
        externalId={detailDrawer.externalId}
      />
    </div>
  );
}