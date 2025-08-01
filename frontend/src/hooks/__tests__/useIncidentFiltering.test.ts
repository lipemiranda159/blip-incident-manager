import { renderHook } from '@testing-library/react';
import { useIncidentFiltering } from '../useIncidentFiltering';
import { generateMockIncidents } from '../../utils/mockData';
import { type Filter } from '../../types';

describe('useIncidentFiltering', () => {
  const mockIncidents = generateMockIncidents(10);

  it('should return all incidents when no filters are applied', () => {
    const filters: Filter = {};
    const { result } = renderHook(() => useIncidentFiltering(mockIncidents, filters));
    
    expect(result.current).toHaveLength(10);
    expect(result.current).toEqual(mockIncidents);
  });

  it('should filter by status', () => {
    const filters: Filter = { status: 'Aberto' };
    const { result } = renderHook(() => useIncidentFiltering(mockIncidents, filters));
    
    result.current.forEach(incident => {
      expect(incident.status).toBe('Aberto');
    });
  });

  it('should filter by priority', () => {
    const filters: Filter = { priority: 'Alta' };
    const { result } = renderHook(() => useIncidentFiltering(mockIncidents, filters));
    
    result.current.forEach(incident => {
      expect(incident.priority).toBe('Alta');
    });
  });

  it('should filter by search term in title', () => {
    const testIncidents = [
      { ...mockIncidents[0], title: 'Sistema fora do ar' },
      { ...mockIncidents[1], title: 'Erro ao fazer login' },
      { ...mockIncidents[2], title: 'Problema na impressora' }
    ];
    
    const filters: Filter = { search: 'sistema' };
    const { result } = renderHook(() => useIncidentFiltering(testIncidents, filters));
    
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Sistema fora do ar');
  });

  it('should filter by search term in description', () => {
    const testIncidents = [
      { ...mockIncidents[0], description: 'Descrição com sistema importante' },
      { ...mockIncidents[1], description: 'Descrição normal' }
    ];
    
    const filters: Filter = { search: 'sistema' };
    const { result } = renderHook(() => useIncidentFiltering(testIncidents, filters));
    
    expect(result.current).toHaveLength(1);
    expect(result.current[0].description).toBe('Descrição com sistema importante');
  });

  it('should be case insensitive for search', () => {
    const testIncidents = [
      { ...mockIncidents[0], title: 'Sistema Fora do Ar' }
    ];
    
    const filters: Filter = { search: 'SISTEMA' };
    const { result } = renderHook(() => useIncidentFiltering(testIncidents, filters));
    
    expect(result.current).toHaveLength(1);
  });

  it('should filter by date range - dateFrom', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    const testIncidents = [
      { ...mockIncidents[0], createdAt: now },
      { ...mockIncidents[1], createdAt: twoDaysAgo }
    ];
    
    const filters: Filter = { dateFrom: yesterday.toISOString().split('T')[0] };
    const { result } = renderHook(() => useIncidentFiltering(testIncidents, filters));
    
    expect(result.current).toHaveLength(1);
    expect(result.current[0].createdAt).toEqual(now);
  });

  it('should filter by date range - dateTo', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    const testIncidents = [
      { ...mockIncidents[0], createdAt: now },
      { ...mockIncidents[1], createdAt: twoDaysAgo }
    ];
    
    const filters: Filter = { dateTo: yesterday.toISOString().split('T')[0] };
    const { result } = renderHook(() => useIncidentFiltering(testIncidents, filters));
    
    expect(result.current).toHaveLength(1);
    expect(result.current[0].createdAt).toEqual(twoDaysAgo);
  });

  it('should apply multiple filters simultaneously', () => {
    const testIncidents = [
      { ...mockIncidents[0], status: 'Aberto', priority: 'Alta', title: 'Sistema crítico' },
      { ...mockIncidents[1], status: 'Aberto', priority: 'Baixa', title: 'Sistema normal' },
      { ...mockIncidents[2], status: 'Resolvido', priority: 'Alta', title: 'Sistema crítico' }
    ];
    
    const filters: Filter = {
      status: 'Aberto',
      priority: 'Alta',
      search: 'crítico'
    };
    
    const { result } = renderHook(() => useIncidentFiltering(testIncidents, filters));
    
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual(testIncidents[0]);
  });

  it('should return empty array when no incidents match filters', () => {
    const filters: Filter = { status: 'NonExistentStatus' as any };
    const { result } = renderHook(() => useIncidentFiltering(mockIncidents, filters));
    
    expect(result.current).toHaveLength(0);
  });

  it('should update results when filters change', () => {
    let filters: Filter = { status: 'Aberto' };
    const { result, rerender } = renderHook(
      ({ filters }) => useIncidentFiltering(mockIncidents, filters),
      { initialProps: { filters } }
    );
    
    const initialLength = result.current.length;
    
    // Change filters
    filters = { status: 'Resolvido' };
    rerender({ filters });
    
    // Results should be different (unless all incidents have same status)
    if (initialLength > 0) {
      result.current.forEach(incident => {
        expect(incident.status).toBe('Resolvido');
      });
    }
  });
});
