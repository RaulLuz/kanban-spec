'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Board } from '@/types';

export function useBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all boards
  const loadBoards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/boards');
      if (!response.ok) {
        throw new Error('Failed to load boards');
      }
      const data = await response.json();
      setBoards(data.boards);
      
      // Set first board as current if none selected
      if (data.boards.length > 0 && !currentBoardId) {
        setCurrentBoardId(data.boards[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load boards');
    } finally {
      setLoading(false);
    }
  }, [currentBoardId]);

  // Create a new board
  const createBoard = useCallback(async (name: string): Promise<Board> => {
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create board');
      }

      const data = await response.json();
      const newBoard = data.board;
      
      setBoards((prev) => [...prev, newBoard]);
      setCurrentBoardId(newBoard.id);
      
      return newBoard;
    } catch (err) {
      throw err;
    }
  }, []);

  // Delete a board
  const deleteBoard = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete board');
      }

      setBoards((prev) => {
        const filtered = prev.filter((b) => b.id !== id);
        
        // If deleted board was current, select another or set to null
        if (currentBoardId === id) {
          setCurrentBoardId(filtered.length > 0 ? filtered[0].id : null);
        }
        
        return filtered;
      });
    } catch (err) {
      throw err;
    }
  }, [currentBoardId]);

  // Select a board
  const selectBoard = useCallback((id: string) => {
    setCurrentBoardId(id);
  }, []);

  // Get current board
  const currentBoard = boards.find((b) => b.id === currentBoardId) || null;

  // Load boards on mount
  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  return {
    boards,
    currentBoard,
    currentBoardId,
    loading,
    error,
    createBoard,
    deleteBoard,
    selectBoard,
    refreshBoards: loadBoards,
  };
}
