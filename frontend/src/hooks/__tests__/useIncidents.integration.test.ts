import { renderHook, act, waitFor } from '@testing-library/react';
import { useIncidents } from '../useIncidents';
import { type Filter } from '../../types';

// Integration tests without mocking - test real functionality
describe('useIncidents Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('full workflow integration', () => {
    it('should load incidents, filter them, and paginate correctly', async () => {
      const { result } = renderHook(() => useIncidents());

      // Initial state
      expect(result.current.loading).toBe(true);
      expect(result.current.incidents).toEqual([]);

      // Wait for initial data to load
      act(() => {
        jest.advanceTimersByTime(800);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have loaded incidents
      expect(result.current.incidents.length).toBeGreaterThan(0);
      expect(result.current.incidents.length).toBeLessThanOrEqual(10); // First page

      // Test filtering
      const initialCount = result.current.incidents.length;
      
      act(() => {
        result.current.setFilters({ status: 'Aberto' });
      });

      // Wait for pagination to reset and reload
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // All returned incidents should have 'Aberto' status
      result.current.incidents.forEach(incident => {
        expect(incident.status).toBe('Aberto');
      });

      // Test search filtering
      act(() => {
        result.current.setFilters({ search: 'sistema' });
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // All returned incidents should contain 'sistema' in title or description
      result.current.incidents.forEach(incident => {
        const titleMatch = incident.title.toLowerCase().includes('sistema');
        const descMatch = incident.description.toLowerCase().includes('sistema');
        expect(titleMatch || descMatch).toBe(true);
      });
    });

    it('should handle pagination correctly', async () => {
      const { result } = renderHook(() => useIncidents());

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(800);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstPageCount = result.current.incidents.length;
      const hasMoreInitially = result.current.hasMore;

      if (hasMoreInitially) {
        // Load more incidents
        act(() => {
          result.current.loadMoreIncidents();
        });

        act(() => {
          jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        // Should have more incidents now
        expect(result.current.incidents.length).toBeGreaterThan(firstPageCount);
      }
    });

    it('should create, update, and retrieve incidents', async () => {
      const { result } = renderHook(() => useIncidents());

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(800);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialCount = result.current.incidents.length;

      // Create a new incident
      const newIncidentData = {
        title: 'Integration Test Incident',
        description: 'This is a test incident for integration testing',
        status: 'Aberto' as const,
        priority: 'Alta' as const,
        createdBy: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          type: 'solicitante' as const,
          avatar: ''
        },
        category: 'Teste',
        tags: ['integration', 'test']
      };

      let createdIncident: any;

      await act(async () => {
        createdIncident = await result.current.createIncident(newIncidentData);
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify incident was created
      expect(createdIncident).toBeDefined();
      expect(createdIncident.id).toMatch(/^INC-\d{4}$/);
      expect(createdIncident.title).toBe(newIncidentData.title);
      expect(createdIncident.comments).toEqual([]);

      // Test getIncidentById
      const retrievedIncident = result.current.getIncidentById(createdIncident.id);
      expect(retrievedIncident).toEqual(createdIncident);

      // Test updating the incident
      const updates = {
        status: 'Em andamento' as const,
        priority: 'Média' as const
      };

      await act(async () => {
        await result.current.updateIncident(createdIncident.id, updates);
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify incident was updated
      const updatedIncident = result.current.getIncidentById(createdIncident.id);
      expect(updatedIncident?.status).toBe('Em andamento');
      expect(updatedIncident?.priority).toBe('Média');
      expect(updatedIncident?.updatedAt).not.toEqual(createdIncident.updatedAt);

      // Test adding a comment
      const commentText = 'This is a test comment';
      const commentAuthor = newIncidentData.createdBy;

      await act(async () => {
        await result.current.addComment(createdIncident.id, commentText, commentAuthor);
      });

      // Verify comment was added
      const incidentWithComment = result.current.getIncidentById(createdIncident.id);
      expect(incidentWithComment?.comments).toHaveLength(1);
      expect(incidentWithComment?.comments[0].content).toBe(commentText);
      expect(incidentWithComment?.comments[0].author).toEqual(commentAuthor);
    });

    it('should handle complex filtering scenarios', async () => {
      const { result } = renderHook(() => useIncidents());

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(800);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Test multiple filters
      const complexFilters: Filter = {
        status: 'Aberto',
        priority: 'Alta',
        search: 'sistema'
      };

      act(() => {
        result.current.setFilters(complexFilters);
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // All incidents should match all filters
      result.current.incidents.forEach(incident => {
        expect(incident.status).toBe('Aberto');
        expect(incident.priority).toBe('Alta');
        const titleMatch = incident.title.toLowerCase().includes('sistema');
        const descMatch = incident.description.toLowerCase().includes('sistema');
        expect(titleMatch || descMatch).toBe(true);
      });

      // Test date filtering
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const dateFilters: Filter = {
        dateFrom: yesterday.toISOString().split('T')[0]
      };

      act(() => {
        result.current.setFilters(dateFilters);
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // All incidents should be created after yesterday
      result.current.incidents.forEach(incident => {
        expect(new Date(incident.createdAt).getTime()).toBeGreaterThanOrEqual(yesterday.getTime());
      });
    });

    it('should handle edge cases gracefully', async () => {
      const { result } = renderHook(() => useIncidents());

      // Wait for initial load
      act(() => {
        jest.advanceTimersByTime(800);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Test getting non-existent incident
      const nonExistentIncident = result.current.getIncidentById('NON-EXISTENT');
      expect(nonExistentIncident).toBeNull();

      // Test filtering with no matches
      act(() => {
        result.current.setFilters({ status: 'NonExistentStatus' as any });
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.incidents).toEqual([]);
      expect(result.current.hasMore).toBe(false);

      // Test clearing filters
      act(() => {
        result.current.setFilters({});
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have incidents again
      expect(result.current.incidents.length).toBeGreaterThan(0);
    });
  });
});
