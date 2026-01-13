# Implementation Plan: Robust Kanban Board

**Branch**: `001-kanban-board` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-kanban-board/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a robust Kanban board application with task management, drag-and-drop functionality, and dark/light mode support. The application will allow users to create multiple boards, organize tasks into columns, track subtasks, and customize column appearance. Technical approach uses Next.js 14 with TypeScript for type safety, Tailwind CSS for styling aligned with the Figma design system (extracted from node 0:9066), SQLite database (better-sqlite3) with Drizzle ORM for data persistence via Next.js API routes, and client-side state management for real-time interactions. Design system includes complete color palette, typography (Plus Jakarta Sans), and component specifications extracted from Figma.

## Technical Context

**Language/Version**: TypeScript 5.x (latest stable)  
**Primary Dependencies**: Next.js 14.x (App Router), React 18.x, Tailwind CSS 3.x  
**Storage**: SQLite (better-sqlite3) via Next.js API routes, database migrations with drizzle-orm  
**Testing**: Jest 29.x with ts-jest, React Testing Library, @testing-library/jest-dom, @testing-library/user-event, jest-environment-jsdom, Playwright (E2E)  
**Target Platform**: Web (desktop-first, responsive for tablet/mobile)  
**Project Type**: Single web application  
**Performance Goals**: 
- Initial page load <1s (First Contentful Paint)
- Task drag-and-drop interactions <100ms response time
- Board operations <200ms (p95)
- Smooth 60fps animations for drag-and-drop
**Constraints**: 
- SQLite database file stored locally (user's device)
- Database operations via Next.js API routes (server-side)
- Must handle database migrations on first run
- Must support modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
- Database file location: `./data/kanban.db` (development) / user data directory (production)
**Scale/Scope**: 
- Support 1000+ boards per user
- 100+ tasks per board
- 10+ subtasks per task
- Multiple columns per board (typically 3-7)
- Database size: ~50-100MB for typical usage (SQLite supports up to 281TB)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Test-First Development**: ✓ All features will follow TDD workflow (tests written first)
**Clean Code**: ✓ Code structure follows single responsibility principle
**Domain-Driven Design**: ✓ Kanban domain concepts (Board, Column, Task) are explicitly modeled
**Automated Testing**: ✓ Testing pyramid strategy defined (unit > integration > E2E)
**Code Quality**: ✓ Linting (ESLint), type checking (TypeScript), and code review process defined
**User Experience Consistency**: ✓ Design system extracted from Figma, UX patterns defined for consistent interactions
**Performance Optimization**: ✓ Performance targets defined (<100ms interactions, <200ms operations, <1s page load)

**Violations**: None

## Project Structure

### Documentation (this feature)

```text
specs/001-kanban-board/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── ui-design.md         # Design system and UI specifications from Figma
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── database.md          # Phase 1 output - Database schema and design
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js App Router Structure
app/
├── layout.tsx           # Root layout with theme provider
├── page.tsx             # Home/board selection page
├── board/
│   └── [id]/
│       └── page.tsx     # Board view page
└── api/                 # Next.js API routes for database operations
    ├── boards/
    │   ├── route.ts     # GET, POST /api/boards
    │   └── [id]/
    │       └── route.ts # GET, PATCH, DELETE /api/boards/[id]
    ├── columns/
    │   ├── route.ts     # POST /api/columns
    │   └── [id]/
    │       └── route.ts # PATCH, DELETE /api/columns/[id]
    ├── tasks/
    │   ├── route.ts     # POST /api/tasks
    │   ├── [id]/
    │   │   └── route.ts # GET, PATCH, DELETE /api/tasks/[id]
    │   └── move/
    │       └── route.ts # PATCH /api/tasks/move
    └── subtasks/
        ├── route.ts     # POST /api/subtasks
        └── [id]/
            └── route.ts # PATCH, DELETE /api/subtasks/[id]

src/
├── components/
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   └── Dropdown.tsx
│   ├── board/           # Board-specific components
│   │   ├── BoardHeader.tsx
│   │   ├── BoardSidebar.tsx
│   │   ├── Column.tsx
│   │   ├── TaskCard.tsx
│   │   └── NewColumnButton.tsx
│   ├── task/            # Task-specific components
│   │   ├── TaskModal.tsx
│   │   ├── TaskForm.tsx
│   │   └── SubtaskList.tsx
│   └── modals/          # Modal components
│       ├── AddBoardModal.tsx
│       ├── EditBoardModal.tsx
│       ├── DeleteBoardModal.tsx
│       ├── AddTaskModal.tsx
│       ├── EditTaskModal.tsx
│       ├── ViewTaskModal.tsx
│       └── DeleteTaskModal.tsx
├── lib/
│   ├── models/          # Domain models
│   │   ├── Board.ts
│   │   ├── Column.ts
│   │   ├── Task.ts
│   │   └── Subtask.ts
│   ├── db/              # Database configuration and schema
│   │   ├── index.ts     # Database connection (better-sqlite3)
│   │   ├── schema.ts    # Drizzle schema definitions
│   │   └── migrations/  # Database migration files
│   ├── services/        # Business logic services
│   │   ├── BoardService.ts
│   │   ├── ColumnService.ts
│   │   ├── TaskService.ts
│   │   ├── SubtaskService.ts
│   │   └── ThemeService.ts
│   ├── hooks/           # Custom React hooks
│   │   ├── useBoard.ts
│   │   ├── useTask.ts
│   │   ├── useTheme.ts
│   │   └── useDragAndDrop.ts
│   ├── utils/           # Utility functions
│   │   ├── validation.ts
│   │   ├── constants.ts
│   │   └── uuid.ts      # UUID generation utilities
│   └── styles/          # Design tokens and theme
│       ├── tokens.ts    # Design tokens from Figma
│       └── theme.ts     # Theme configuration
├── types/               # TypeScript type definitions
│   └── index.ts
└── __tests__/           # Test utilities
    └── test-utils.tsx

tests/
├── unit/                # Unit tests
│   ├── components/
│   │   ├── ui/
│   │   ├── board/
│   │   ├── task/
│   │   └── modals/
│   ├── lib/
│   │   ├── models/
│   │   ├── services/
│   │   └── hooks/
│   └── utils/
├── integration/         # Integration tests
│   ├── workflows/
│   └── services/
└── e2e/                 # End-to-end tests
    └── kanban.spec.ts

# Configuration Files
jest.config.js           # Jest configuration (uses next/jest)
jest.setup.js            # Jest setup file (imports @testing-library/jest-dom)
playwright.config.ts     # Playwright E2E configuration
drizzle.config.ts        # Drizzle ORM configuration
.env.local               # Environment variables (database path, etc.)

# Database
data/
├── kanban.db            # SQLite database file (gitignored)
└── migrations/          # Migration history (if needed)
```

**Structure Decision**: Single Next.js application using App Router with SQLite database backend. Components organized by domain (board, task, ui) with shared utilities and services. Database operations handled via Next.js API routes using better-sqlite3 and Drizzle ORM. Database schema defined in src/lib/db/schema.ts with migrations in src/lib/db/migrations/. Design tokens extracted from Figma design system. Testing structure follows pyramid approach with unit tests at base (Jest + React Testing Library), integration tests for workflows including database operations, and E2E tests (Playwright) for critical user journeys. Jest configured with ts-jest for TypeScript support and jsdom environment for React component testing.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations to justify.

## UI/UX Design Reference

**Figma File**: [Y21VMIMjSNvHqbOFb56JZK](https://www.figma.com/design/Y21VMIMjSNvHqbOFb56JZK/kanban-task-management-web-app)

**Design System**: Extracted from node `0:9066`
- Colors: Primary purple (#635FC7), neutral palette, accent red (#EA5555)
- Typography: Plus Jakarta Sans font family with defined heading and body styles
- Interactive elements: Buttons, form fields, checkboxes, dropdowns
- Component specifications: Sidebar, board header, columns, task cards

**Board Layout**: Extracted from node `0:8800`
- Sidebar structure: 300px width, board list, theme toggle
- Board header: Title display, add task button
- Column layout: Horizontal scrollable columns with color indicators
- Task cards: Summary view with title and subtask progress

**Modal Components**: Available in Figma (see ui-design.md for node references)
- View Task, Add Task, Edit Task
- Add Board, Edit Board, Delete Board
- Delete Task

**Dark Mode**: Fully specified in design system with dark mode variants for all components.

See [ui-design.md](./ui-design.md) for complete design specifications and design tokens.
