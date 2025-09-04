import { useState } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import type { ClientsQuery } from '@/types/client';

interface ClientsFiltersProps {
  filters: ClientsQuery;
  onFiltersChange: (filters: ClientsQuery) => void;
  onReset: () => void;
}

export function ClientsFilters({ filters, onFiltersChange, onReset }: ClientsFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [selectedStates, setSelectedStates] = useState<string[]>(
    filters.estado ? filters.estado.split(',') : []
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleStateChange = (state: string, checked: boolean) => {
    let newStates: string[];
    if (checked) {
      newStates = [...selectedStates, state];
    } else {
      newStates = selectedStates.filter(s => s !== state);
    }
    
    setSelectedStates(newStates);
    onFiltersChange({ 
      ...filters, 
      estado: newStates.length > 0 ? newStates.join(',') : undefined 
    });
  };

  const handleOrderChange = (order: string) => {
    onFiltersChange({ 
      ...filters, 
      order: order as ClientsQuery['order'] 
    });
  };

  const handleLimitChange = (limit: string) => {
    onFiltersChange({ 
      ...filters, 
      limit: parseInt(limit),
      offset: 0 // Reset pagination
    });
  };

  const handleReset = () => {
    setSearchValue('');
    setSelectedStates([]);
    onReset();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border">
      {/* Cercador */}
      <div className="flex-1 max-w-xs">
        <Label htmlFor="search" className="sr-only">Cerca</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Cerca..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filtre d'estat */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <Filter className="mr-2 h-4 w-4" />
            Estat
            {selectedStates.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                {selectedStates.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Filtrar per estat</h4>
            {['OK', 'ERROR', 'EXCEPTION'].map((state) => (
              <div key={state} className="flex items-center space-x-2">
                <Checkbox
                  id={state}
                  checked={selectedStates.includes(state)}
                  onCheckedChange={(checked) => 
                    handleStateChange(state, checked as boolean)
                  }
                />
                <Label htmlFor={state} className="text-sm">
                  {state}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Ordenació */}
      <Select 
        value={filters.order || 'fecha_desc'} 
        onValueChange={handleOrderChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordena per" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fecha_desc">Data (nou a antic)</SelectItem>
          <SelectItem value="fecha_asc">Data (antic a nou)</SelectItem>
          <SelectItem value="external_id_asc">ID (A-Z)</SelectItem>
          <SelectItem value="external_id_desc">ID (Z-A)</SelectItem>
        </SelectContent>
      </Select>

      {/* Límit */}
      <Select 
        value={filters.limit?.toString() || '25'} 
        onValueChange={handleLimitChange}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Límit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      <Button 
        variant="outline" 
        onClick={handleReset}
        className="px-3"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Restablir filtres</span>
      </Button>
    </div>
  );
}