import { renderHook, act, waitFor } from '@testing-library/react';
import { usePagination } from '../usePagination';

// Mock setTimeout to avoid actual delays in tests
jest.useFakeTimers();

describe('usePagination', () => {
  const mockItems = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      usePagination({
        items: mockItems,
        itemsPerPage: 10,
      })
    );

    expect(result.current.paginatedItems).toEqual([]);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loading).toBe(true);
  });

  it('should load first page of items', async () => {
    const { result } = renderHook(() =>
      usePagination({
        items: mockItems,
        itemsPerPage: 10,
      })
    );

    // Fast-forward timers to resolve the loading delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.paginatedItems).toHaveLength(10);
    expect(result.current.paginatedItems[0]).toEqual({ id: 1, name: 'Item 1' });
    expect(result.current.paginatedItems[9]).toEqual({ id: 10, name: 'Item 10' });
    expect(result.current.hasMore).toBe(true);
  });

  it('should load more items when loadMore is called', async () => {
    const { result } = renderHook(() =>
      usePagination({
        items: mockItems,
        itemsPerPage: 10,
      })
    );

    // Wait for first page to load
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Load more items
    act(() => {
      result.current.loadMore();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.paginatedItems).toHaveLength(20);
    expect(result.current.paginatedItems[10]).toEqual({ id: 11, name: 'Item 11' });
    expect(result.current.hasMore).toBe(true);
  });

  it('should set hasMore to false when all items are loaded', async () => {
    const { result } = renderHook(() =>
      usePagination({
        items: mockItems,
        itemsPerPage: 10,
      })
    );

    // Load all pages
    for (let i = 0; i < 3; i++) {
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      if (result.current.hasMore) {
        act(() => {
          result.current.loadMore();
        });
      }
    }

    expect(result.current.paginatedItems).toHaveLength(25);
    expect(result.current.hasMore).toBe(false);
  });

  it('should not load more when loading is true', async () => {
    const { result } = renderHook(() =>
      usePagination({
        items: mockItems,
        itemsPerPage: 10,
      })
    );

    // Try to load more while still loading
    act(() => {
      result.current.loadMore();
    });

    // Should still be loading and not trigger additional load
    expect(result.current.loading).toBe(true);
  });

  it('should not load more when hasMore is false', async () => {
    const smallItems = [{ id: 1, name: 'Item 1' }];
    const { result } = renderHook(() =>
      usePagination({
        items: smallItems,
        itemsPerPage: 10,
      })
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);

    const initialLength = result.current.paginatedItems.length;

    act(() => {
      result.current.loadMore();
    });

    // Should not change
    expect(result.current.paginatedItems).toHaveLength(initialLength);
  });

  it('should reset pagination when resetTrigger changes', async () => {
    let resetTrigger = 'trigger1';
    const { result, rerender } = renderHook(
      ({ resetTrigger }) =>
        usePagination({
          items: mockItems,
          itemsPerPage: 10,
          resetTrigger,
        }),
      { initialProps: { resetTrigger } }
    );

    // Load first page
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Load second page
    act(() => {
      result.current.loadMore();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.paginatedItems).toHaveLength(20);

    // Change resetTrigger
    resetTrigger = 'trigger2';
    rerender({ resetTrigger });

    // Should reset to empty and start loading again
    expect(result.current.paginatedItems).toEqual([]);
    expect(result.current.loading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have only first page again
    expect(result.current.paginatedItems).toHaveLength(10);
  });

  it('should handle empty items array', async () => {
    const { result } = renderHook(() =>
      usePagination({
        items: [],
        itemsPerPage: 10,
      })
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.paginatedItems).toEqual([]);
    expect(result.current.hasMore).toBe(false);
  });

  it('should handle items array smaller than itemsPerPage', async () => {
    const smallItems = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    const { result } = renderHook(() =>
      usePagination({
        items: smallItems,
        itemsPerPage: 10,
      })
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.paginatedItems).toHaveLength(2);
    expect(result.current.hasMore).toBe(false);
  });

  it('should reset pagination when reset is called directly', () => {
    const { result } = renderHook(() =>
      usePagination({
        items: mockItems,
        itemsPerPage: 10,
      })
    );

    act(() => {
      result.current.reset();
    });

    expect(result.current.paginatedItems).toEqual([]);
  });
});
