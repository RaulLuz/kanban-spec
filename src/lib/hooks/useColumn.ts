'use client';

import { useState, useCallback, useEffect } from 'react';
import { ColumnService } from '@/lib/services/ColumnService';
import type { Column } from '@/types';

export function useColumn(boardId: string | null) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadColumns = useCallback(async () => {
    if (!boardId) {
      setColumns([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cols = await ColumnService.getColumnsByBoard(boardId);
      setColumns(cols);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load columns';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    loadColumns();
  }, [loadColumns]);

  return {
    columns,
    loading,
    error,
    refreshColumns: loadColumns,
  };
}
