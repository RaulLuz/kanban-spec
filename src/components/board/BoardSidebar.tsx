'use client';

import type { Board } from '@/types';

interface BoardSidebarProps {
  boards: Board[];
  currentBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: () => void;
  onDeleteBoard: (board: Board) => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

export function BoardSidebar({
  boards,
  currentBoardId,
  onSelectBoard,
  onCreateBoard,
  onDeleteBoard,
  onToggleTheme,
  theme,
}: BoardSidebarProps) {
  return (
    <aside className="w-[300px] bg-white dark:bg-dark-grey border-r border-lines-light dark:border-lines-dark flex flex-col h-screen">
      {/* Logo/Header */}
      <div className="p-6 border-b border-lines-light dark:border-lines-dark">
        <h1 className="text-heading-xl text-black dark:text-white font-bold">kanban</h1>
      </div>

      {/* Boards List */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-heading-s text-medium-grey uppercase mb-4 px-4">
          All Boards ({boards.length})
        </p>
        <ul className="space-y-1">
          {boards.map((board) => (
            <li key={board.id}>
              <button
                onClick={() => onSelectBoard(board.id)}
                aria-label={`Select board: ${board.name}`}
                aria-current={currentBoardId === board.id ? 'true' : 'false'}
                className={`w-full text-left px-4 py-3 rounded-r-full flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-main-purple ${
                  currentBoardId === board.id
                    ? 'bg-main-purple text-white'
                    : 'text-medium-grey hover:bg-light-grey dark:hover:bg-dark-grey hover:text-main-purple'
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  className={currentBoardId === board.id ? 'fill-white' : 'fill-medium-grey'}
                >
                  <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.111h2a1.556 1.556 0 0 0 1.556-1.556v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" />
                </svg>
                <span className="text-heading-m">{board.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBoard(board);
                  }}
                  className="ml-auto text-medium-grey hover:text-red transition-colors"
                  aria-label={`Delete ${board.name}`}
                >
                  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M12.728 0l2.122 2.122L2.122 14.85 0 12.728 12.728 0zM14.85 12.728l-2.122 2.122L0 2.122 2.122 0 14.85 12.728z" />
                  </svg>
                </button>
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onCreateBoard}
          aria-label="Create new board"
          className="w-full text-left px-4 py-3 rounded-r-full flex items-center gap-3 text-main-purple hover:bg-light-grey dark:hover:bg-dark-grey transition-colors mt-4 focus:outline-none focus:ring-2 focus:ring-main-purple"
        >
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="fill-main-purple">
            <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.111h2a1.556 1.556 0 0 0 1.556-1.556v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" />
          </svg>
          <span className="text-heading-m">+ Create New Board</span>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-lines-light dark:border-lines-dark">
        <div className="bg-light-grey dark:bg-very-dark-grey rounded-md p-3 flex items-center justify-center gap-6">
          <svg width="19" height="19" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.167 15.833a.833.833 0 0 1 .833.834v.833a.833.833 0 0 1-1.667 0v-.833a.833.833 0 0 1 .834-.834ZM3.75 13.75a.833.833 0 0 1 .59 1.422l-1.25 1.25a.833.833 0 0 1-1.18-1.178l1.25-1.25a.833.833 0 0 1 .59-.244Zm10.833 0c.221 0 .433.088.59.244l1.25 1.25a.833.833 0 0 1-1.178 1.178l-1.25-1.25a.833.833 0 0 1 .59-1.422ZM9.167 5a4.167 4.167 0 1 1 0 8.334 4.167 4.167 0 0 1 0-8.334Zm-7.5 3.333a.833.833 0 0 1 0 1.667H.833a.833.833 0 1 1 0-1.667h.834Zm15.833 0a.833.833 0 0 1 0 1.667h-.833a.833.833 0 0 1 0-1.667h.833Zm-1.667-6.666a.833.833 0 0 1 .59 1.422l-1.25 1.25a.833.833 0 1 1-1.179-1.178l1.25-1.25a.833.833 0 0 1 .59-.244Zm-13.333 0c.221 0 .433.088.59.244l1.25 1.25a.833.833 0 0 1-1.18 1.178L1.99 3.09a.833.833 0 0 1 .59-1.422ZM9.167 0A.833.833 0 0 1 10 .833v.834a.833.833 0 1 1-1.667 0V.833A.833.833 0 0 1 9.167 0Z"
              fill={theme === 'light' ? '#828FA3' : '#FFFFFF'}
            />
          </svg>
          <button
            onClick={onToggleTheme}
            className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-main-purple ${
              theme === 'dark' ? 'bg-main-purple' : 'bg-main-purple'
            }`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.474.682c.434-.11.718.406.481.78a6.068 6.068 0 0 0 0 6.546c.237.374-.047.89-.48.78a6.117 6.117 0 0 1-4.79-4.79c-.11-.433.406-.718.78-.48a6.067 6.067 0 0 0 6.546 0ZM12.88 11.307a.75.75 0 0 1-.75-.75 5.25 5.25 0 1 0-1.5 3.716.75.75 0 1 1-1.06 1.06A6.75 6.75 0 1 1 17.25 10.557a.75.75 0 0 1-1.06 1.06 5.25 5.25 0 0 0-3.31-1.31Z"
              fill={theme === 'dark' ? '#FFFFFF' : '#828FA3'}
            />
          </svg>
        </div>
      </div>
    </aside>
  );
}
