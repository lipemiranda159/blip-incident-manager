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
  BdsChipClickable,
  BdsDatepicker
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
            <BdsDatepicker 
              type-of-date="period" 
              onBdsStartDate={(e: CustomEvent) => {
                const dateValue = e.detail.value;
                
                // Converter Date para string no formato DD/MM/YYYY se necessário
                let dateString = '';
                if (dateValue instanceof Date) {
                  const day = dateValue.getDate().toString().padStart(2, '0');
                  const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
                  const year = dateValue.getFullYear();
                  dateString = `${day}/${month}/${year}`;
                } else if (typeof dateValue === 'string') {
                  dateString = dateValue;
                }
                
                updateFilter('dateFrom', dateString);
              }} 
              onBdsEndDate={(e: CustomEvent) => {
                const dateValue = e.detail.value;
                
                // Converter Date para string no formato DD/MM/YYYY se necessário
                let dateString = '';
                if (dateValue instanceof Date) {
                  const day = dateValue.getDate().toString().padStart(2, '0');
                  const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
                  const year = dateValue.getFullYear();
                  dateString = `${day}/${month}/${year}`;
                } else if (typeof dateValue === 'string') {
                  dateString = dateValue;
                }
                
                updateFilter('dateTo', dateString);
              }} 
              start-date-limit="31/12/2022" 
              end-date-limit="01/01/2027" />
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
              <BdsChipClickable icon='close' onClick={() => updateFilter('status', '')} color="info" clickable={true}>
                Status: {filters.status}
              </BdsChipClickable>
            )}
            {filters.priority && (
              <BdsChipClickable icon='close' onClick={() => updateFilter('priority', '')} color="success" clickable={true}>
                Prioridade: {filters.priority}
              </BdsChipClickable>
            )}
            {filters.dateFrom && (
              <BdsChipClickable icon='close' onClick={() => updateFilter('dateFrom', '')} color="warning" clickable={true}>
                Data inicial: {filters.dateFrom}
              </BdsChipClickable>
            )}
            {filters.dateTo && (
              <BdsChipClickable icon='close' onClick={() => updateFilter('dateTo', '')} color="warning" clickable={true}>
                Data final: {filters.dateTo}
              </BdsChipClickable>
            )}
          </BdsGrid>
        )}
      </BdsGrid>
    </BdsGrid>
  );
};