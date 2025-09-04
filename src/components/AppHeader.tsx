import { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApiHealthIndicator } from './ApiHealthIndicator';
import { apiClient } from '@/lib/api';

interface AppHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function AppHeader({ onRefresh, isRefreshing }: AppHeaderProps) {
  const [baseUrl, setBaseUrl] = useState(apiClient.getBaseUrl());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSaveSettings = () => {
    apiClient.setBaseUrl(baseUrl);
    setIsSettingsOpen(false);
    // Refresh per aplicar la nova URL
    onRefresh();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">Gestor de Clients</h1>
          <ApiHealthIndicator />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualitza
          </Button>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Configuració</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Configuració</DialogTitle>
                <DialogDescription>
                  Configura la URL base de l'API
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="base-url">URL Base de l'API</Label>
                  <Input
                    id="base-url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                  />
                  <p className="text-sm text-muted-foreground">
                    Aquesta configuració es guarda localment al navegador
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Cancel·la
                </Button>
                <Button onClick={handleSaveSettings}>
                  Desa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}