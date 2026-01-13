import { render } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render function with providers
 */
export function renderWithProviders(ui: ReactElement) {
  return render(ui);
}

export * from '@testing-library/react';
