'use client';

import { Button } from '../ui/Button';

interface EmptyStateProps {
  onCreateBoard: () => void;
}

export function EmptyState({ onCreateBoard }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <p className="text-heading-l text-medium-grey mb-6">
        There are no boards available. Create a new board to get started.
      </p>
      <Button onClick={onCreateBoard} variant="primary">
        + Create New Board
      </Button>
    </div>
  );
}
