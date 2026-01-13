# Research: Robust Kanban Board

**Feature**: Robust Kanban Board  
**Date**: 2025-01-27  
**Phase**: 0 - Outline & Research

## Technical Decisions

### Decision: Next.js App Router vs Pages Router

**Decision**: Use Next.js 14 App Router

**Rationale**: 
- App Router provides better performance with React Server Components
- Improved data fetching patterns
- Better TypeScript support
- Modern React patterns (async components, streaming)
- Better code splitting and loading states

**Alternatives considered**:
- Pages Router: More mature but less performant, requires more boilerplate
- Remix: Good option but less ecosystem support
- Vite + React: More setup required, Next.js provides better DX out of the box

### Decision: State Management Approach

**Decision**: React Context + useReducer for client-side state, LocalStorage for persistence

**Rationale**:
- Simple state management sufficient for single-user application
- No need for complex state management libraries (Redux, Zustand) initially
- React Context provides good performance for this scale
- Can migrate to more complex solution if needed later

**Alternatives considered**:
- Zustand: Good option but adds dependency, not needed for initial scope
- Redux Toolkit: Overkill for current requirements
- Jotai/Recoil: Good atomic state management but adds complexity

### Decision: Drag and Drop Library

**Decision**: Use @dnd-kit/core for drag and drop functionality

**Rationale**:
- Modern, performant drag and drop library
- Better accessibility than react-beautiful-dnd
- TypeScript support
- Works well with React 18
- Good performance for large lists

**Alternatives considered**:
- react-beautiful-dnd: Deprecated, no longer maintained
- react-dnd: More complex API, better for complex scenarios
- Native HTML5 drag and drop: Too low-level, requires significant implementation

### Decision: Styling Approach

**Decision**: Tailwind CSS with design tokens extracted from Figma

**Rationale**:
- Tailwind CSS aligns with Next.js best practices
- Design tokens from Figma can be mapped to Tailwind config
- Utility-first approach matches component-based architecture
- Good dark mode support
- Excellent performance with JIT compilation

**Alternatives considered**:
- CSS Modules: More verbose, requires more setup
- Styled Components: Runtime overhead, not needed for static styles
- CSS-in-JS (Emotion): Runtime overhead, Tailwind is more performant

### Decision: Storage Strategy

**Decision**: SQLite (better-sqlite3) with Drizzle ORM via Next.js API routes

**Rationale**:
- SQLite provides robust relational database capabilities
- better-sqlite3 offers synchronous API suitable for server-side operations
- Drizzle ORM provides type-safe database operations with TypeScript
- Next.js API routes enable server-side database access without separate backend
- SQLite file can be stored locally (user's device) or synced to cloud storage
- Supports complex queries, transactions, and data integrity
- Better than LocalStorage for structured data with relationships
- Migration system ensures schema evolution

**Alternatives considered**:
- LocalStorage: Too limited for complex relational data, no query capabilities
- IndexedDB: More complex API, better for client-side but we need server-side
- PostgreSQL/MySQL: Requires separate database server, overkill for single-user app
- Prisma: Good ORM but Drizzle is lighter and more flexible
- TypeORM: More opinionated, Drizzle provides better TypeScript integration

### Decision: Testing Strategy

**Decision**: Jest + React Testing Library for unit/integration, Playwright for E2E

**Rationale**:
- Jest: Industry standard, excellent TypeScript support
- React Testing Library: Best practices for React component testing
- Playwright: Modern E2E framework, better than Cypress for this use case
- Testing pyramid: Many unit tests, fewer integration, minimal E2E

**Alternatives considered**:
- Vitest: Good option but Jest has better Next.js integration
- Cypress: Good but Playwright has better performance and features
- Testing Library alternatives: RTL is the standard

### Decision: Theme Management

**Decision**: CSS variables + Tailwind dark mode + React Context for theme state

**Rationale**:
- CSS variables provide performant theme switching
- Tailwind dark mode utilities simplify dark mode implementation
- React Context manages theme state and persistence
- No flash of wrong theme with proper implementation

**Alternatives considered**:
- Theme provider libraries: Add unnecessary dependencies
- CSS-in-JS theme: Runtime overhead, CSS variables are faster
- Separate CSS files: More complex to maintain

## Best Practices Research

### Drag and Drop Best Practices
- Provide visual feedback during drag (opacity, scale)
- Show drop zones clearly
- Handle edge cases (drag outside, rapid movements)
- Maintain accessibility (keyboard navigation)
- Optimize for performance (virtualization if needed)

### Kanban Board Patterns
- Column-based organization is standard
- Task cards show summary information
- Full task details in modal/overlay
- Color coding for visual organization
- Drag and drop is expected interaction pattern

### Performance Optimization
- Virtualize long lists if needed
- Debounce rapid interactions
- Optimize re-renders with React.memo
- Lazy load modals
- Code split by route

### Accessibility Considerations
- Keyboard navigation for all interactions
- ARIA labels for drag and drop
- Screen reader announcements
- Focus management in modals
- Color contrast meets WCAG AA

## Integration Patterns

### Component Communication
- Props for parent-child communication
- Context for global state (boards, theme)
- Custom hooks for reusable logic
- Event handlers for user interactions

### Data Flow
- Unidirectional data flow (React pattern)
- Services handle business logic
- Models represent domain entities
- Storage service abstracts persistence

## Dependencies Research

### Core Dependencies
- **next**: 14.x - React framework
- **react**: 18.x - UI library
- **react-dom**: 18.x - React DOM renderer
- **typescript**: 5.x - Type safety

### UI Dependencies
- **tailwindcss**: 3.x - Styling
- **@dnd-kit/core**: Latest - Drag and drop
- **@dnd-kit/sortable**: Latest - Sortable lists
- **@dnd-kit/utilities**: Latest - DnD utilities

### Database Dependencies
- **better-sqlite3**: Latest - SQLite database driver (synchronous, server-side)
- **drizzle-orm**: Latest - TypeScript ORM for SQLite
- **drizzle-kit**: Latest - Drizzle migration and introspection tools
- **@types/better-sqlite3**: Latest - TypeScript types for better-sqlite3

### Development Dependencies
- **@types/react**: Latest - TypeScript types
- **@types/node**: Latest - Node types
- **eslint**: Latest - Linting
- **eslint-config-next**: Latest - Next.js ESLint config
- **jest**: 29.x - Testing framework
- **jest-environment-jsdom**: 29.x - JSDOM environment for React component testing
- **@jest/globals**: 29.x - Jest globals (describe, it, expect, etc.)
- **ts-jest**: Latest - TypeScript preprocessor for Jest
- **@testing-library/react**: Latest - Component testing utilities
- **@testing-library/jest-dom**: Latest - Jest DOM matchers (toBeInTheDocument, etc.)
- **@testing-library/user-event**: Latest - User interaction simulation
- **@testing-library/react-hooks**: Latest - Testing React hooks (if needed)
- **playwright**: Latest - E2E testing framework
- **@playwright/test**: Latest - Playwright test runner

## Database Decision Details

### Why SQLite over LocalStorage/IndexedDB

**SQLite Advantages**:
- Relational database with proper foreign keys and constraints
- ACID transactions for data integrity
- Complex queries (JOINs, aggregations, subqueries)
- Better performance for structured data
- Migration system for schema evolution
- Type-safe queries with Drizzle ORM

**better-sqlite3 Advantages**:
- Synchronous API (simpler than async for server-side)
- Better performance than node-sqlite3
- Active maintenance and TypeScript support
- Works seamlessly with Next.js API routes

**Drizzle ORM Advantages**:
- Lightweight and performant
- Excellent TypeScript support
- Type-safe queries and migrations
- Flexible query builder
- Better than Prisma for this use case (lighter, more control)

### Database Location Strategy

**Development**: `./data/kanban.db` (project directory)
**Production**: User's data directory (OS-specific)
- Windows: `%APPDATA%/kanban/kanban.db`
- macOS: `~/Library/Application Support/kanban/kanban.db`
- Linux: `~/.local/share/kanban/kanban.db`

### Migration Strategy

- Drizzle Kit generates migration files
- Migrations run automatically on app startup
- Version tracking in database
- Rollback capability for failed migrations

## Unresolved Questions

None - all technical decisions made based on requirements and best practices.
