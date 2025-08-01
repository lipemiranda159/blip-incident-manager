import { useState, useEffect, useCallback } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
  resetTrigger?: any; // Trigger to reset pagination
}

interface UsePaginationReturn<T> {
  paginatedItems: T[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
  reset: () => void;
}

export const usePagination = <T>({
  items,
  itemsPerPage,
  resetTrigger
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [page, setPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const hasMore = page * itemsPerPage < items.length;

  const reset = useCallback(() => {
    setPage(1);
    setPaginatedItems([]);
  }, []);

  // Reset pagination when resetTrigger changes
  useEffect(() => {
    reset();
  }, [resetTrigger, reset]);

  // Load items when page or items change
  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (!cancelled) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const newItems = items.slice(start, end);
        
        setPaginatedItems(prev => page === 1 ? newItems : [...prev, ...newItems]);
        setLoading(false);
      }
    };

    loadItems();

    return () => {
      cancelled = true;
    };
  }, [page, items, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  return {
    paginatedItems,
    hasMore,
    loading,
    loadMore,
    reset
  };
};
