import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Client } from '@/types/client';

interface StatsCardsProps {
  clients: Client[];
}

export function StatsCards({ clients }: StatsCardsProps) {
  const stats = useMemo(() => {
    const ok = clients.filter(c => c.estado === 'OK').length;
    const error = clients.filter(c => c.estado === 'ERROR').length;
    const exception = clients.filter(c => c.estado === 'EXCEPTION').length;
    const total = ok + error + exception;
    
    const successRate = total > 0 ? Math.round((ok / total) * 100) : 0;

    return { ok, error, exception, successRate };
  }, [clients]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">OK</CardTitle>
          <div className="w-2 h-2 rounded-full bg-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{stats.ok}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ERROR</CardTitle>
          <div className="w-2 h-2 rounded-full bg-error" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-error">{stats.error}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">EXCEPTION</CardTitle>
          <div className="w-2 h-2 rounded-full bg-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{stats.exception}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Èxit</CardTitle>
          <div className="w-2 h-2 rounded-full bg-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.successRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
}