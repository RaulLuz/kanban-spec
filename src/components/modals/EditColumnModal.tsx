'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Column } from '@/types';

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

interface EditColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: Column;
  onColumnUpdated: () => void;
}

const COLOR_PRESETS = [
  '#635FC7', // Main Purple
  '#A8A4FF', // Main Purple Hover
  '#EA5555', // Red
  '#FF9898', // Red Hover
  '#49C4E5', // Blue
  '#67E2AE', // Green
  '#FFD700', // Yellow
  '#FF6B6B', // Coral
  '#4ECDC4', // Teal
  '#95E1D3', // Mint
];

export function EditColumnModal({
  isOpen,
  onClose,
  column,
  onColumnUpdated,
}: EditColumnModalProps) {
  const [name, setName] = useState(column.name);
  const [color, setColor] = useState(column.color);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(column.name);
      setColor(column.color);
      setError(null);
    }
  }, [isOpen, column]);

  useModalClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Column name is required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/columns/${column.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), color }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update column');
      }

      onColumnUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update column');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-grey rounded-lg p-6 w-full max-w-md">
        <h2 className="text-heading-l text-black dark:text-white mb-6">Edit Column</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="column-name" className="block text-body-m text-medium-grey mb-2">
              Column Name
            </label>
            <Input
              id="column-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Todo"
              error={error || undefined}
              required
            />
          </div>

          <div>
            <label className="block text-body-m text-medium-grey mb-2">
              Color Indicator
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {COLOR_PRESETS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    color === presetColor
                      ? 'border-main-purple scale-110'
                      : 'border-medium-grey border-opacity-25 hover:border-opacity-50'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded border border-medium-grey border-opacity-25 cursor-pointer"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#635FC7"
                className="flex-1"
              />
            </div>
          </div>

          {error && (
            <p className="text-red text-body-m">{error}</p>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
