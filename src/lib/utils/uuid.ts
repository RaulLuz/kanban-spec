/**
 * Generate a unique ID for entity IDs
 * Works in both client and server environments
 */
export function generateId(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use crypto.randomUUID if available, otherwise fallback
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  }
  
  // Fallback: timestamp + random string
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
