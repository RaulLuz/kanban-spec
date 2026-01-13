import { randomUUID } from 'crypto';

/**
 * Generate a UUID v4 for entity IDs
 */
export function generateId(): string {
  return randomUUID();
}
