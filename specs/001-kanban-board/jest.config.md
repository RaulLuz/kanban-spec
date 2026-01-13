# Jest Configuration: Robust Kanban Board

**Feature**: Robust Kanban Board  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Jest Configuration

### jest.config.js

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### jest.setup.js

```javascript
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Test utility functions and services
- Test domain models and business logic
- Mock external dependencies (localStorage, Next.js router)
- Use React Testing Library for component testing
- Target: 80%+ coverage for business logic

### Integration Tests
- Test component interactions
- Test service workflows
- Test data flow between components
- Test drag and drop functionality
- Test theme switching

### E2E Tests (Playwright)
- Test complete user journeys
- Test critical workflows (create board, add task, drag and drop)
- Test theme persistence
- Test data persistence across page refresh

## Test File Naming Convention

- Unit tests: `*.test.ts` or `*.test.tsx`
- Component tests: `ComponentName.test.tsx`
- Service tests: `ServiceName.test.ts`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.spec.ts` (Playwright)

## Example Test Structure

```typescript
// src/components/board/TaskCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from './TaskCard'

describe('TaskCard', () => {
  it('renders task title', () => {
    const task = { id: '1', title: 'Test Task', subtasks: [] }
    render(<TaskCard task={task} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('displays subtask progress', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      subtasks: [
        { id: '1', title: 'Subtask 1', isCompleted: true },
        { id: '2', title: 'Subtask 2', isCompleted: false },
      ],
    }
    render(<TaskCard task={task} />)
    expect(screen.getByText('1 of 2 substasks')).toBeInTheDocument()
  })

  it('opens task modal on click', async () => {
    const user = userEvent.setup()
    const task = { id: '1', title: 'Test Task', subtasks: [] }
    const onOpen = jest.fn()
    render(<TaskCard task={task} onOpen={onOpen} />)
    
    await user.click(screen.getByText('Test Task'))
    expect(onOpen).toHaveBeenCalledWith(task.id)
  })
})
```

## Coverage Requirements

Per constitution, test coverage MUST exceed 80% for all business logic:
- Services: 80%+ coverage
- Components: 80%+ coverage for business logic
- Models: 100% coverage (domain models are critical)
- Utils: 80%+ coverage

## Test Data and Fixtures

Create test fixtures for common test data:

```typescript
// src/__tests__/fixtures/boards.ts
export const mockBoard = {
  id: 'board-1',
  name: 'Test Board',
  columns: [
    { id: 'col-1', name: 'Todo', color: '#635FC7', tasks: [] },
    { id: 'col-2', name: 'Doing', color: '#EA5555', tasks: [] },
  ],
}

export const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  columnId: 'col-1',
  subtasks: [],
}
```
