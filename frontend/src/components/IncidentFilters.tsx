import React from 'react';
import type { Filter as FilterType } from '../types';
import {
  BdsIcon,
  BdsGrid,
  BdsInput,
  BdsSelect,
  BdsSelectOption,
  BdsButton,
  BdsTypo,
  BdsChipTag
} from 'blip-ds/dist/blip-ds-react/components';

interface IncidentFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  totalItems: number;
}

export const IncidentFilters: React.FC<IncidentFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  totalItems 
}) => {
  const updateFilter = (key: keyof FilterType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <BdsGrid direction="column" gap="3" padding="4" style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
      <BdsGrid direction="row" gap="3" flex-wrap="wrap" align-items="center">
        <BdsGrid direction="column" xxs="12" md="6">
          <BdsInput
            placeholder="Buscar por título ou descrição..."
            value={filters.search || ''}
            onBdsChange={(e: CustomEvent) => updateFilter('search', e.detail.value || '')}
            icon="search"
          />
        </BdsGrid>

        <BdsGrid direction="row" gap="2" flex-wrap="wrap">
          <BdsSelect value={filters.status || ''} onBdsChange={(e: CustomEvent) => updateFilter('status', e.detail.value || '')}>
            <BdsSelectOption value="">Todos os status</BdsSelectOption>
            <BdsSelectOption value="Aberto">Aberto</BdsSelectOption>
            <BdsSelectOption value="Em andamento">Em andamento</BdsSelectOption>
            <BdsSelectOption value="Pendente">Pendente</BdsSelectOption>
            <BdsSelectOption value="Resolvido">Resolvido</BdsSelectOption>
            <BdsSelectOption value="Cancelado">Cancelado</BdsSelectOption>
          </BdsSelect>

          <BdsSelect value={filters.priority || ''} onBdsChange={(e: CustomEvent) => updateFilter('priority', e.detail.value || '')}>
            <BdsSelectOption value="">Todas as prioridades</BdsSelectOption>
            <BdsSelectOption value="Baixa">Baixa</BdsSelectOption>
            <BdsSelectOption value="Média">Média</BdsSelectOption>
            <BdsSelectOption value="Alta">Alta</BdsSelectOption>
            <BdsSelectOption value="Crítica">Crítica</BdsSelectOption>
          </BdsSelect>

          <BdsGrid direction="row" gap="1">
            <BdsInput
              type="date"
              value={filters.dateFrom || ''}
              onBdsChange={(e: CustomEvent) => updateFilter('dateFrom', e.detail.value || '')}
              placeholder="Data inicial"
            />
            <BdsInput
              type="date"
              value={filters.dateTo || ''}
              onBdsChange={(e: CustomEvent) => updateFilter('dateTo', e.detail.value || '')}
              placeholder="Data final"
            />
          </BdsGrid>

          {hasActiveFilters && (
            <BdsButton
              variant="ghost"
              size="short"
              onBdsClick={clearFilters}
              icon="close"
            >
              Limpar
            </BdsButton>
          )}
        </BdsGrid>
      </BdsGrid>

      <BdsGrid direction="row" justify-content="space-between" align-items="center">
        <BdsGrid direction="row" gap="1" align-items="center">
          <BdsIcon name="filter" size="small" />
          <BdsTypo variant="fs-14" color="content-secondary">
            {totalItems} incidente{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
          </BdsTypo>
        </BdsGrid>

        {hasActiveFilters && (
          <BdsGrid direction="row" gap="1" flex-wrap="wrap">
            {filters.status && (
              <BdsChipTag color="info">
                Status: {filters.status}
                <BdsButton 
                  variant="ghost" 
                  size="short" 
                  icon="close" 
                  onBdsClick={() => updateFilter('status', '')}
                  style={{ marginLeft: '4px', minWidth: 'auto', padding: '2px' }}
                />
              </BdsChipTag>
            )}
            {filters.priority && (
              <BdsChipTag color="success">
                Prioridade: {filters.priority}
                <BdsButton 
                  variant="ghost" 
                  size="short" 
                  icon="close" 
                  onBdsClick={() => updateFilter('priority', '')}
                  style={{ marginLeft: '4px', minWidth: 'auto', padding: '2px' }}
                />
              </BdsChipTag>
            )}
          </BdsGrid>
        )}
      </BdsGrid>
    </BdsGrid>
  );
};