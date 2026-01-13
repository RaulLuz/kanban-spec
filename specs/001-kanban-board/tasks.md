# Tasks: Robust Kanban Board

**Input**: Design documents from `/specs/001-kanban-board/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, database.md

**Tests**: Tests are MANDATORY per constitution (Test-First Development principle). All features MUST include test tasks following TDD workflow: write tests first, ensure they fail, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Next.js App Router structure with `app/`, `src/`, `tests/` at repository root
- All paths shown below follow the structure defined in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Next.js 14 project structure with App Router in repository root
- [x] T002 [P] Install core dependencies: next@14.x, react@18.x, react-dom@18.x, typescript@5.x
- [x] T003 [P] Install UI dependencies: tailwindcss@3.x, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- [x] T004 [P] Install database dependencies: better-sqlite3, drizzle-orm, drizzle-kit, @types/better-sqlite3
- [x] T005 [P] Install testing dependencies: jest@29.x, jest-environment-jsdom@29.x, @jest/globals@29.x, ts-jest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, playwright, @playwright/test
- [x] T006 [P] Install development dependencies: @types/react, @types/node, @types/jest, eslint, eslint-config-next, @typescript-eslint/eslint-plugin, @typescript-eslint/parser
- [x] T007 [P] Configure TypeScript in tsconfig.json with Next.js App Router settings
- [x] T008 [P] Configure Tailwind CSS in tailwind.config.js with design tokens from Figma
- [x] T009 [P] Configure ESLint in .eslintrc.json with Next.js and TypeScript rules
- [x] T010 [P] Create .env.local with DATABASE_PATH=./data/kanban.db
- [x] T011 [P] Create .gitignore with node_modules, .next, data/, .env.local, coverage
- [x] T012 Create directory structure: app/, src/components/, src/lib/, tests/, data/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Setup

- [x] T013 Create database connection in src/lib/db/index.ts with better-sqlite3
- [x] T014 [P] Define Drizzle schema in src/lib/db/schema.ts for boards, columns, tasks, subtasks, theme_preferences tables
- [x] T015 [P] Configure Drizzle in drizzle.config.ts with SQLite driver settings
- [x] T016 Create initial migration in src/lib/db/migrations/0000_initial_schema.sql
- [x] T017 [P] Implement migration runner in src/lib/db/migrate.ts to run migrations on startup
- [x] T018 [P] Create database initialization script that creates default board if none exists

### Base Models & Types

- [x] T019 [P] Create Board domain model in src/lib/models/Board.ts with validation
- [x] T020 [P] Create Column domain model in src/lib/models/Column.ts with validation
- [x] T021 [P] Create Task domain model in src/lib/models/Task.ts with validation
- [x] T022 [P] Create Subtask domain model in src/lib/models/Subtask.ts with validation
- [x] T023 [P] Create TypeScript types in src/types/index.ts for Board, Column, Task, Subtask, Theme

### Utilities & Constants

- [x] T024 [P] Create UUID utility in src/lib/utils/uuid.ts for generating IDs
- [x] T025 [P] Create validation utilities in src/lib/utils/validation.ts for entity validation
- [x] T026 [P] Create constants in src/lib/utils/constants.ts (default colors, column names, etc.)
- [x] T027 [P] Create design tokens in src/lib/styles/tokens.ts from Figma design system
- [x] T028 [P] Create theme configuration in src/lib/styles/theme.ts with light/dark mode support

### API Infrastructure

- [x] T029 Create API route structure in app/api/ with error handling middleware
- [x] T030 [P] Create error response utilities in src/lib/utils/errors.ts (ValidationError, NotFoundError, BusinessRuleError, StorageError)
- [x] T031 [P] Create API response helpers in src/lib/utils/api-response.ts for consistent JSON responses

### Testing Infrastructure

- [x] T032 Configure Jest in jest.config.js with next/jest and ts-jest
- [x] T033 Create jest.setup.js with @testing-library/jest-dom and Next.js router mocks
- [x] T034 [P] Create test utilities in src/__tests__/test-utils.tsx with render helpers
- [x] T035 [P] Create database test utilities in tests/unit/db/test-utils.ts for in-memory test database
- [x] T036 Configure Playwright in playwright.config.ts for E2E tests

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Manage Boards (Priority: P1) 🎯 MVP

**Goal**: Users can create, view, select, and delete multiple Kanban boards independently

**Independent Test**: Can be fully tested by creating a new board, viewing the list of boards in the sidebar, selecting a board to view its content, and deleting a board.

### Tests for User Story 1 (MANDATORY - Test-First Development) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. Tests are required per constitution.**

- [x] T037 [P] [US1] Write unit test for Board model validation in tests/unit/lib/models/Board.test.ts
- [x] T038 [P] [US1] Write unit test for BoardService.createBoard in tests/unit/lib/services/BoardService.test.ts
- [x] T039 [P] [US1] Write unit test for BoardService.getAllBoards in tests/unit/lib/services/BoardService.test.ts
- [x] T040 [P] [US1] Write unit test for BoardService.deleteBoard in tests/unit/lib/services/BoardService.test.ts
- [x] T041 [P] [US1] Write integration test for POST /api/boards endpoint in tests/integration/api/boards.test.ts
- [x] T042 [P] [US1] Write integration test for GET /api/boards endpoint in tests/integration/api/boards.test.ts
- [x] T043 [P] [US1] Write integration test for DELETE /api/boards/[id] endpoint in tests/integration/api/boards.test.ts
- [x] T044 [P] [US1] Write E2E test for board creation workflow in tests/e2e/boards.spec.ts
- [x] T044A [P] [US1] Write performance test for SC-001: Verify board creation completes within 2 seconds in tests/integration/performance/board-creation.test.ts

### Implementation for User Story 1

- [x] T045 [US1] Implement BoardService in src/lib/services/BoardService.ts with createBoard, getAllBoards, getBoard, updateBoard, deleteBoard methods
- [x] T046 [US1] Implement POST /api/boards route in app/api/boards/route.ts for creating boards
- [x] T047 [US1] Implement GET /api/boards route in app/api/boards/route.ts for listing all boards
- [x] T048 [US1] Implement GET /api/boards/[id]/route.ts for getting a single board
- [x] T049 [US1] Implement DELETE /api/boards/[id]/route.ts for deleting boards with business rule validation (cannot delete last board)
- [x] T049A [US1] Handle edge case: Prevent deletion of last remaining board with user-friendly error message
- [x] T050 [US1] Create BoardSidebar component in src/components/board/BoardSidebar.tsx to display board list
- [x] T051 [US1] Create AddBoardModal component in src/components/modals/AddBoardModal.tsx for creating new boards
- [x] T051A [US1] Handle edge case: Board creation with no name - show validation error and prevent creation
- [x] T052 [US1] Create DeleteBoardModal component in src/components/modals/DeleteBoardModal.tsx for confirming board deletion
- [x] T053 [US1] Create useBoard hook in src/lib/hooks/useBoard.ts for board state management
- [x] T054 [US1] Integrate BoardSidebar in app/layout.tsx to show board list on all pages
- [x] T055 [US1] Create empty state component in src/components/board/EmptyState.tsx for when no boards exist
- [x] T056 [US1] Implement board selection logic to switch active board when clicking sidebar item

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can create, view, select, and delete boards.

---

## Phase 4: User Story 2 - Manage Tasks with Subtasks (Priority: P1) 🎯 MVP

**Goal**: Users can create tasks with titles, descriptions, and subtasks, and track progress at both task and subtask levels

**Independent Test**: Can be fully tested by creating a task with a title and description, adding multiple subtasks to that task, marking subtasks as complete using checkboxes, and viewing the task status.

### Tests for User Story 2 (MANDATORY - Test-First Development) ⚠️

- [x] T057 [P] [US2] Write unit test for Task model validation in tests/unit/lib/models/Task.test.ts
- [x] T058 [P] [US2] Write unit test for Subtask model validation in tests/unit/lib/models/Subtask.test.ts
- [x] T059 [P] [US2] Write unit test for TaskService.createTask in tests/unit/lib/services/TaskService.test.ts
- [x] T060 [P] [US2] Write unit test for SubtaskService.createSubtask in tests/unit/lib/services/SubtaskService.test.ts
- [x] T061 [P] [US2] Write unit test for SubtaskService.toggleSubtask in tests/unit/lib/services/SubtaskService.test.ts
- [x] T062 [P] [US2] Write integration test for POST /api/tasks endpoint in tests/integration/api/tasks.test.ts
- [x] T063 [P] [US2] Write integration test for POST /api/subtasks endpoint in tests/integration/api/subtasks.test.ts
- [x] T064 [P] [US2] Write integration test for PATCH /api/subtasks/[id] endpoint in tests/integration/api/subtasks.test.ts
- [x] T065 [P] [US2] Write E2E test for task creation with subtasks workflow in tests/e2e/tasks.spec.ts

### Implementation for User Story 2

- [x] T066 [US2] Implement TaskService in src/lib/services/TaskService.ts with createTask, getTask, updateTask, deleteTask methods
- [x] T067 [US2] Implement SubtaskService in src/lib/services/SubtaskService.ts with createSubtask, updateSubtask, toggleSubtask, deleteSubtask methods
- [x] T068 [US2] Implement POST /api/tasks route in app/api/tasks/route.ts for creating tasks
- [x] T069 [US2] Implement GET /api/tasks/[id]/route.ts for getting a single task with subtasks
- [x] T070 [US2] Implement POST /api/subtasks route in app/api/subtasks/route.ts for creating subtasks
- [x] T071 [US2] Implement PATCH /api/subtasks/[id]/route.ts for updating subtasks (including toggle completion)
- [x] T072 [US2] Create TaskForm component in src/components/task/TaskForm.tsx for creating/editing tasks
- [x] T073 [US2] Create SubtaskList component in src/components/task/SubtaskList.tsx for displaying and managing subtasks with checkboxes
- [x] T074 [US2] Create AddTaskModal component in src/components/modals/AddTaskModal.tsx for creating new tasks
- [x] T075 [US2] Create ViewTaskModal component in src/components/modals/ViewTaskModal.tsx for viewing task details with subtasks
- [x] T076 [US2] Create EditTaskModal component in src/components/modals/EditTaskModal.tsx for editing tasks
- [x] T077 [US2] Create useTask hook in src/lib/hooks/useTask.ts for task state management
- [x] T078 [US2] Implement subtask completion tracking logic to calculate completed/total subtask counts
- [x] T078A [US2] Handle edge case: Task status calculation - derive status from column name (todo/doing/done) in TaskService
- [x] T078B [US2] Handle edge case: Task with no subtasks - display "0 of 0 subtasks" or hide count in task card

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can create boards and manage tasks with subtasks.

---

## Phase 5: User Story 3 - Organize Tasks in Columns with Drag and Drop (Priority: P2)

**Goal**: Users can organize tasks into columns and move them between columns using drag and drop

**Independent Test**: Can be fully tested by creating columns in a board, adding tasks to columns, dragging a task from one column to another, and verifying the task appears in the new column.

### Tests for User Story 3 (MANDATORY - Test-First Development) ⚠️

- [ ] T079 [P] [US3] Write unit test for Column model validation in tests/unit/lib/models/Column.test.ts
- [ ] T080 [P] [US3] Write unit test for ColumnService.createColumn in tests/unit/lib/services/ColumnService.test.ts
- [ ] T081 [P] [US3] Write unit test for TaskService.moveTask in tests/unit/lib/services/TaskService.test.ts
- [ ] T082 [P] [US3] Write integration test for POST /api/columns endpoint in tests/integration/api/columns.test.ts
- [ ] T083 [P] [US3] Write integration test for PATCH /api/tasks/[id]/move endpoint in tests/integration/api/tasks-move.test.ts
- [ ] T084 [P] [US3] Write E2E test for drag and drop workflow in tests/e2e/drag-and-drop.spec.ts
- [ ] T084A [P] [US3] Write performance test for SC-002: Verify 100% drag and drop accuracy in tests/integration/performance/drag-and-drop.test.ts

### Implementation for User Story 3

- [x] T085 [US3] Implement ColumnService in src/lib/services/ColumnService.ts with createColumn, updateColumn, deleteColumn, reorderColumns methods
- [x] T086 [US3] Implement POST /api/columns route in app/api/columns/route.ts for creating columns
- [x] T087 [US3] Implement PATCH /api/columns/[id]/route.ts for updating columns
- [x] T088 [US3] Implement PATCH /api/tasks/[id]/move/route.ts for moving tasks between columns
- [x] T089 [US3] Create Column component in src/components/board/Column.tsx to display column with tasks
- [x] T090 [US3] Create useDragAndDrop hook in src/lib/hooks/useDragAndDrop.ts with @dnd-kit integration
- [x] T091 [US3] Integrate drag and drop in Column component using @dnd-kit/sortable
- [x] T092 [US3] Implement task position updates when dragging between columns
- [ ] T093 [US3] Create NewColumnButton component in src/components/board/NewColumnButton.tsx for adding new columns
- [x] T094 [US3] Implement default columns creation (Todo, Doing, Done) when board is created
- [x] T095 [US3] Add visual feedback during drag operations (opacity, scale animations)
- [x] T095A [US3] Handle edge case: Drag task outside column - cancel drag and return to original position
- [x] T095B [US3] Handle edge case: Move task to non-existent column - validate column exists before move

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can create boards, manage tasks with subtasks, and organize tasks in columns with drag and drop.

---

## Phase 6: User Story 4 - Customize Column Appearance (Priority: P2)

**Goal**: Users can change the color indicator for each column to visually distinguish columns

**Independent Test**: Can be fully tested by viewing a column, changing its color indicator, and verifying the new color is displayed.

### Tests for User Story 4 (MANDATORY - Test-First Development) ⚠️

- [ ] T096 [P] [US4] Write unit test for ColumnService.updateColumn color change in tests/unit/lib/services/ColumnService.test.ts
- [ ] T097 [P] [US4] Write integration test for PATCH /api/columns/[id] with color update in tests/integration/api/columns.test.ts
- [ ] T098 [P] [US4] Write E2E test for column color customization in tests/e2e/columns.spec.ts

### Implementation for User Story 4

- [x] T099 [US4] Create color picker component in src/components/ui/ColorPicker.tsx for selecting column colors (integrated in EditColumnModal)
- [x] T100 [US4] Add color indicator display in Column component showing colored circle (15px diameter) at top of column header per Figma design
- [x] T101 [US4] Implement column color update in ColumnService.updateColumn method
- [x] T102 [US4] Create EditColumnModal component in src/components/modals/EditColumnModal.tsx for editing column name and color
- [x] T103 [US4] Add color picker UI to EditColumnModal with predefined color palette from design system
- [x] T104 [US4] Persist column color changes to database via PATCH /api/columns/[id] endpoint

**Checkpoint**: At this point, User Stories 1-4 should all work. Users can customize column colors.

---

## Phase 7: User Story 5 - View Task Cards in Columns (Priority: P2)

**Goal**: Users can see task cards in columns showing summary information (title, subtask counts)

**Independent Test**: Can be fully tested by viewing a column with tasks, verifying each task card shows the title, total subtask count, and completed subtask count.

### Tests for User Story 5 (MANDATORY - Test-First Development) ⚠️

- [ ] T105 [P] [US5] Write unit test for TaskCard component rendering in tests/unit/components/board/TaskCard.test.tsx
- [ ] T106 [P] [US5] Write unit test for subtask count calculation logic in tests/unit/lib/utils/task-utils.test.ts
- [ ] T107 [P] [US5] Write integration test for task card display in tests/integration/components/TaskCard.test.tsx
- [ ] T108 [P] [US5] Write E2E test for task card visibility in tests/e2e/task-cards.spec.ts

### Implementation for User Story 5

- [x] T109 [US5] Create TaskCard component in src/components/board/TaskCard.tsx to display task summary
- [x] T110 [US5] Implement task card display showing task title
- [x] T111 [US5] Implement subtask count calculation utility in src/lib/utils/task-utils.ts (integrated in TaskCard)
- [x] T112 [US5] Display subtask progress in TaskCard (e.g., "3 of 5 subtasks")
- [x] T113 [US5] Style TaskCard according to Figma design system with proper spacing and typography
- [x] T114 [US5] Add click handler to TaskCard to open ViewTaskModal
- [x] T115 [US5] Integrate TaskCard into Column component to display tasks in columns
- [x] T116 [US5] Handle edge case: display "0 of 0 subtasks" or hide count when no subtasks exist
- [x] T116A [US5] Handle edge case: Very long task titles - truncate with ellipsis in TaskCard component (max 50 chars with tooltip)

**Checkpoint**: At this point, User Stories 1-5 should all work. Users can view task cards with summary information in columns.

---

## Phase 8: User Story 6 - Toggle Between Light and Dark Mode (Priority: P3)

**Goal**: Users can switch between light and dark themes for comfortable viewing

**Independent Test**: Can be fully tested by viewing the application in light mode, toggling to dark mode via the sidebar control, and verifying all UI elements adapt to the new theme.

### Tests for User Story 6 (MANDATORY - Test-First Development) ⚠️

- [ ] T117 [P] [US6] Write unit test for ThemeService.getTheme in tests/unit/lib/services/ThemeService.test.ts
- [ ] T118 [P] [US6] Write unit test for ThemeService.setTheme in tests/unit/lib/services/ThemeService.test.ts
- [ ] T119 [P] [US6] Write unit test for useTheme hook in tests/unit/lib/hooks/useTheme.test.ts
- [ ] T120 [P] [US6] Write integration test for GET /api/theme endpoint in tests/integration/api/theme.test.ts
- [ ] T121 [P] [US6] Write integration test for PATCH /api/theme endpoint in tests/integration/api/theme.test.ts
- [ ] T122 [P] [US6] Write E2E test for theme toggle workflow in tests/e2e/theme.spec.ts

### Implementation for User Story 6

- [ ] T123 [US6] Implement ThemeService in src/lib/services/ThemeService.ts with getTheme, setTheme methods
- [ ] T124 [US6] Implement GET /api/theme route in app/api/theme/route.ts for getting theme preference
- [ ] T125 [US6] Implement PATCH /api/theme route in app/api/theme/route.ts for updating theme preference
- [ ] T126 [US6] Create useTheme hook in src/lib/hooks/useTheme.ts for theme state management
- [ ] T127 [US6] Create ThemeProvider component in src/components/providers/ThemeProvider.tsx with React Context
- [ ] T128 [US6] Add theme toggle button in BoardSidebar component
- [ ] T129 [US6] Implement Tailwind dark mode configuration in tailwind.config.js
- [ ] T130 [US6] Apply dark mode classes to all components (boards, tasks, columns, sidebar, modals)
- [ ] T131 [US6] Persist theme preference to database in theme_preferences table
- [ ] T132 [US6] Load theme preference on app initialization in app/layout.tsx
- [ ] T133 [US6] Prevent flash of wrong theme by applying theme before first render
- [ ] T133A [US6] Handle edge case: Rapid theme toggling - debounce theme changes to prevent UI flicker

**Checkpoint**: At this point, all user stories should be complete. Users can toggle between light and dark mode.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T134 [P] Update documentation in README.md with setup instructions and feature overview
- [ ] T135 [P] Add JSDoc comments to all public APIs and services
- [ ] T136 [P] Code cleanup and refactoring: review all components for single responsibility
- [ ] T137 [P] Performance optimization: implement React.memo for expensive components
- [ ] T138 [P] Performance optimization: optimize database queries with proper indexes
- [ ] T139 [P] Performance optimization: implement virtual scrolling for large task lists if needed
- [x] T140 [P] Accessibility: Add ARIA labels to all interactive elements
- [x] T141 [P] Accessibility: Ensure keyboard navigation works for all features
- [x] T142 [P] Accessibility: Add screen reader announcements for drag and drop operations
- [x] T143 [P] Error handling: Add user-friendly error messages throughout the application
- [x] T144 [P] Error handling: Implement error boundaries in React components
- [ ] T145 [P] Loading states: Add loading indicators for all async operations
- [ ] T146 [P] Validation: Add client-side validation to all forms
- [ ] T147 [P] Edge cases: Handle deletion of last board (prevent or show empty state)
- [ ] T148 [P] Edge cases: Handle task with no subtasks in task card display
- [ ] T149 [P] Edge cases: Handle drag outside column (cancel or return to original)
- [ ] T150 [P] Edge cases: Handle very long task titles with truncation
- [ ] T151 [P] Edge cases: Handle rapid theme toggling
- [ ] T152 [P] Run quickstart.md validation scenarios
- [ ] T153 [P] Ensure all tests pass with 80%+ coverage for business logic
- [ ] T154 [P] Run performance tests to verify <200ms API response times
- [ ] T155 [P] Run accessibility audit (WCAG 2.1 Level AA compliance)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Requires US1 for board context but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Requires US1 (boards) and US2 (tasks) but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Requires US1 (boards) and US3 (columns) but should be independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Requires US1 (boards), US2 (tasks), US3 (columns) but should be independently testable
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Independent, can be implemented at any time

### Within Each User Story

- Tests (MANDATORY) MUST be written and FAIL before implementation
- Models before services
- Services before API routes
- API routes before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: T037 - Write unit test for Board model validation
Task: T038 - Write unit test for BoardService.createBoard
Task: T039 - Write unit test for BoardService.getAllBoards
Task: T040 - Write unit test for BoardService.deleteBoard
Task: T041 - Write integration test for POST /api/boards endpoint
Task: T042 - Write integration test for GET /api/boards endpoint
Task: T043 - Write integration test for DELETE /api/boards/[id] endpoint

# Launch all models for User Story 1 together (if needed):
Task: T019 - Create Board domain model
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create and Manage Boards)
4. Complete Phase 4: User Story 2 (Manage Tasks with Subtasks)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP Part 1)
3. Add User Story 2 → Test independently → Deploy/Demo (MVP Part 2)
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 (can start after US1 boards exist)
   - Developer C: User Story 6 (theme - independent)
3. After US1 and US2 complete:
   - Developer A: User Story 3 (drag and drop)
   - Developer B: User Story 4 (column colors)
   - Developer C: User Story 5 (task cards)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **Tests are MANDATORY** - write tests FIRST, ensure they FAIL before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Follow TDD workflow: Red (write failing test) → Green (implement) → Refactor
- Ensure 80%+ test coverage for all business logic per constitution

---

## Summary

- **Total Tasks**: 167 (12 new tasks added for edge cases and performance tests)
- **Setup Tasks**: 12 (Phase 1)
- **Foundational Tasks**: 24 (Phase 2)
- **User Story 1 Tasks**: 22 (Phase 3) - Added: T044A (performance test), T049A (edge case), T051A (edge case)
- **User Story 2 Tasks**: 24 (Phase 4) - Added: T078A (status calculation), T078B (no subtasks edge case)
- **User Story 3 Tasks**: 19 (Phase 5) - Added: T084A (performance test), T095A (drag outside), T095B (non-existent column)
- **User Story 4 Tasks**: 9 (Phase 6) - Updated: T100 (color indicator specification)
- **User Story 5 Tasks**: 13 (Phase 7) - Added: T116A (long title truncation)
- **User Story 6 Tasks**: 18 (Phase 8) - Added: T122A (performance test), T133A (rapid toggling)
- **Polish Tasks**: 22 (Phase 9)

**Parallel Opportunities**: Many tasks can run in parallel, especially tests and models within each story phase.

**Suggested MVP Scope**: User Stories 1 & 2 (Create and Manage Boards + Manage Tasks with Subtasks) provide core Kanban functionality.
