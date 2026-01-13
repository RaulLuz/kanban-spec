'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

// Close modal on Escape key
const useModalClose = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
};

interface DeleteBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  boardName: string;
}

export function DeleteBoardModal({
  isOpen,
  onClose,
  onConfirm,
  boardName,
}: DeleteBoardModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useModalClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete board');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-grey rounded-lg p-6 w-full max-w-md">
        <h2 className="text-heading-l text-red mb-4">Delete this board?</h2>
        
        <p className="text-body-l text-medium-grey mb-6">
          Are you sure you want to delete the &quot;{boardName}&quot; board? This action will remove all columns and tasks and cannot be reversed.
        </p>

        {error && (
          <p className="text-red text-body-m mb-4">{error}</p>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
