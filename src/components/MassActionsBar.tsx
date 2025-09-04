import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface MassActionsBarProps {
  selectedClients: string[];
  onClearSelection: () => void;
}

interface ProcessResult {
  externalId: string;
  success: boolean;
  error?: string;
}

export function MassActionsBar({ selectedClients, onClearSelection }: MassActionsBarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessResult[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMassProcess = async () => {
    if (selectedClients.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setResults([]);

    const processResults: ProcessResult[] = [];
    
    for (let i = 0; i < selectedClients.length; i++) {
      const externalId = selectedClients[i];
      
      try {
        await apiClient.processClient(externalId);
        processResults.push({ externalId, success: true });
      } catch (error: any) {
        processResults.push({ 
          externalId, 
          success: false, 
          error: error.message || 'Error desconegut' 
        });
      }

      setProgress(Math.round(((i + 1) / selectedClients.length) * 100));
      setResults([...processResults]);

      // Delay entre crides
      if (i < selectedClients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setIsProcessing(false);
    
    const successes = processResults.filter(r => r.success).length;
    const errors = processResults.filter(r => !r.success).length;

    toast({
      title: 'Processament completat',
      description: `${successes} èxits, ${errors} errors`,
      variant: errors > 0 ? 'destructive' : 'default',
    });

    // Refrescar les dades
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    
    // Clear selection after completion
    setTimeout(() => {
      onClearSelection();
      setResults([]);
      setProgress(0);
    }, 3000);
  };

  if (selectedClients.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedClients.length} clients seleccionats
            </span>
            
            {isProcessing && (
              <div className="flex items-center gap-2">
                <Progress value={progress} className="w-32" />
                <span className="text-sm text-muted-foreground">
                  {progress}%
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClearSelection}
              disabled={isProcessing}
            >
              Cancel·la selecció
            </Button>
            
            <Button
              onClick={handleMassProcess}
              disabled={isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Processa seleccionats
            </Button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Resultats:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between text-xs p-2 rounded border"
                >
                  <span>{result.externalId}</span>
                  {result.success ? (
                    <span className="text-success">✓ Èxit</span>
                  ) : (
                    <span className="text-error" title={result.error}>
                      ✗ Error
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}