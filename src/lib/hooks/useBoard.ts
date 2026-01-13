'use client';

import { useState, useEffect, useCallback } from 'react';
import { BoardService } from '@/lib/services/BoardService';
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
      const allBoards = await BoardService.getAllBoards();
      setBoards(allBoards);
      
      // Set first board as current if none selected
      if (allBoards.length > 0 && !currentBoardId) {
        setCurrentBoardId(allBoards[0].id);
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
      const newBoard = await BoardService.createBoard(name);
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
      await BoardService.deleteBoard(id);
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
