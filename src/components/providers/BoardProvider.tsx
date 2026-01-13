'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useBoard } from '@/lib/hooks/useBoard';
import { BoardSidebar } from '../board/BoardSidebar';
import { AddBoardModal } from '../modals/AddBoardModal';
import { DeleteBoardModal } from '../modals/DeleteBoardModal';
import { EmptyState } from '../board/EmptyState';
import { useState } from 'react';
import type { Board } from '@/types';

interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  currentBoardId: string | null;
  loading: boolean;
  error: string | null;
  createBoard: (name: string) => Promise<Board>;
  deleteBoard: (id: string) => Promise<void>;
  selectBoard: (id: string) => void;
  refreshBoards: () => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function useBoardContext() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within BoardProvider');
  }
  return context;
}

interface BoardProviderProps {
  children: ReactNode;
}

export function BoardProvider({ children }: BoardProviderProps) {
  const boardHook = useBoard();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Load theme from database on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch('/api/theme');
        if (response.ok) {
          const data = await response.json();
          setTheme(data.theme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const handleCreateBoard = async (name: string) => {
    await boardHook.createBoard(name);
    setShowAddModal(false);
  };

  const handleDeleteBoard = async () => {
    if (boardToDelete) {
      await boardHook.deleteBoard(boardToDelete.id);
      setBoardToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = (board: Board) => {
    setBoardToDelete(board);
    setShowDeleteModal(true);
  };

  const toggleTheme = async () => {
    // Debounce rapid toggling
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); // Optimistic update
    
    try {
      const response = await fetch('/api/theme/toggle', {
        method: 'POST',
      });
      if (!response.ok) {
        // Revert on error
        setTheme(theme);
        throw new Error('Failed to toggle theme');
      }
      const data = await response.json();
      setTheme(data.theme);
    } catch (error) {
      console.error('Failed to toggle theme:', error);
      // Already reverted above
    }
  };

  // Apply theme to document
  useEffect(() => {
    if (themeLoaded && typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, themeLoaded]);

  return (
    <BoardContext.Provider value={boardHook}>
      <div className="flex h-screen">
        <BoardSidebar
          boards={boardHook.boards}
          currentBoardId={boardHook.currentBoardId}
          onSelectBoard={boardHook.selectBoard}
          onCreateBoard={() => setShowAddModal(true)}
          onDeleteBoard={handleDeleteClick}
          onToggleTheme={toggleTheme}
          theme={theme}
        />
        
        <main className="flex-1 overflow-auto">
          {boardHook.loading ? (
            <div className="flex items-center justify-center h-screen">
              <p className="text-medium-grey">Loading...</p>
            </div>
          ) : boardHook.boards.length === 0 ? (
            <EmptyState onCreateBoard={() => setShowAddModal(true)} />
          ) : (
            children
          )}
        </main>

        <AddBoardModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateBoard}
        />

        {boardToDelete && (
          <DeleteBoardModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setBoardToDelete(null);
            }}
            onConfirm={handleDeleteBoard}
            boardName={boardToDelete.name}
          />
        )}
      </div>
    </BoardContext.Provider>
  );
}
