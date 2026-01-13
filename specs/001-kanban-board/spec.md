# Feature Specification: Robust Kanban Board

**Feature Branch**: `001-kanban-board`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "o projeto deve ser um kanban robusto onde temos várias tasks que possuem title, description, subtasks (cada subtask deve ser um checkbox, enquanto a task principal tem seu status também. Também terá light e dark mode. O board deve conter colunas para a separação das tasks, contando com drag and drop e bolinha de coloração alterável para cada coluna. Em cada coluna terão as tasks de forma resumida, como um card, mostrando apenas o titulo, a quantidade total de subtasks e quantas foram finalizadas, além de uma sidebar a esquerda que mostrará todos os boards, sendo possível excluir e criar novos, assim como selecionar. Nessa sidebar também terá o toggle de dark e light mode"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Manage Boards (Priority: P1)

As a user, I want to create, view, select, and delete multiple Kanban boards so that I can organize different projects or workflows independently.

**Why this priority**: This is the foundational capability that enables all other features. Without boards, users cannot organize their work. This story delivers immediate value by allowing users to set up their workspace.

**Independent Test**: Can be fully tested by creating a new board, viewing the list of boards in the sidebar, selecting a board to view its content, and deleting a board. This delivers the core organizational structure needed for task management.

**Acceptance Scenarios**:

1. **Given** I am on the Kanban application, **When** I click "Create New Board" in the sidebar, **Then** a new board is created and becomes the active board
2. **Given** I have multiple boards, **When** I view the sidebar, **Then** I see a list of all my boards with their names
3. **Given** I have multiple boards, **When** I click on a board name in the sidebar, **Then** that board becomes active and its content is displayed
4. **Given** I have a board, **When** I click delete on that board, **Then** the board is removed and I am shown a different board or empty state
5. **Given** I have no boards, **When** I first open the application, **Then** I see an empty state prompting me to create my first board

---

### User Story 2 - Manage Tasks with Subtasks (Priority: P1)

As a user, I want to create tasks with titles, descriptions, and subtasks so that I can break down complex work into manageable pieces and track progress at both task and subtask levels.

**Why this priority**: Tasks are the core unit of work in a Kanban system. The ability to create tasks with subtasks is essential for organizing complex work. This story enables users to start tracking their work immediately.

**Independent Test**: Can be fully tested by creating a task with a title and description, adding multiple subtasks to that task, marking subtasks as complete using checkboxes, and viewing the task status. This delivers the fundamental task management capability.

**Acceptance Scenarios**:

1. **Given** I am viewing a board, **When** I create a new task, **Then** I can provide a title and description for the task
2. **Given** I have a task, **When** I add subtasks to it, **Then** each subtask appears as a checkbox item within the task
3. **Given** I have a task with subtasks, **When** I check a subtask checkbox, **Then** that subtask is marked as completed
4. **Given** I have a task, **When** I view the task, **Then** I can see the task's overall status (separate from subtask completion)
5. **Given** I have a task with multiple subtasks, **When** I view the task summary, **Then** I see the total number of subtasks and how many are completed

---

### User Story 3 - Organize Tasks in Columns with Drag and Drop (Priority: P2)

As a user, I want to organize tasks into columns and move them between columns using drag and drop so that I can visualize workflow stages and update task status through movement.

**Why this priority**: Column organization and drag-and-drop are core Kanban functionality that enables workflow visualization. While tasks can exist without columns, the Kanban methodology requires column-based organization for effective workflow management.

**Independent Test**: Can be fully tested by creating columns in a board, adding tasks to columns, dragging a task from one column to another, and verifying the task appears in the new column. This delivers the visual workflow management that defines Kanban.

**Acceptance Scenarios**:

1. **Given** I am viewing a board, **When** I view the board, **Then** I see tasks organized into columns
2. **Given** I have tasks in different columns, **When** I drag a task from one column to another, **Then** the task moves to the new column
3. **Given** I am dragging a task, **When** I release it over a column, **Then** the task is placed in that column
4. **Given** I have multiple columns, **When** I view the board, **Then** I can see all columns and their tasks simultaneously
5. **Given** I move a task between columns, **When** the move completes, **Then** the task's status updates to reflect its new column position

---

### User Story 4 - Customize Column Appearance (Priority: P2)

As a user, I want to change the color indicator for each column so that I can visually distinguish columns and create a personalized board appearance.

**Why this priority**: Color customization enhances visual organization and user experience. While not critical for functionality, it significantly improves usability and user satisfaction with the board.

**Independent Test**: Can be fully tested by viewing a column, changing its color indicator, and verifying the new color is displayed. This delivers visual customization that helps users organize their workflow.

**Acceptance Scenarios**:

1. **Given** I am viewing a board with columns, **When** I view a column, **Then** I see a color indicator (colored circle/dot) for that column
2. **Given** I have a column, **When** I change the column's color indicator, **Then** the new color is applied and displayed
3. **Given** I have multiple columns, **When** I customize each column's color, **Then** each column displays its unique color indicator
4. **Given** I change a column's color, **When** I view the board later, **Then** the column retains its customized color

---

### User Story 5 - View Task Cards in Columns (Priority: P2)

As a user, I want to see task cards in columns showing summary information so that I can quickly scan tasks and understand their progress without opening each task.

**Why this priority**: Task cards provide the essential visual summary needed for efficient Kanban board navigation. Users need to see task information at a glance to make decisions about workflow.

**Independent Test**: Can be fully tested by viewing a column with tasks, verifying each task card shows the title, total subtask count, and completed subtask count. This delivers the information density needed for effective board management.

**Acceptance Scenarios**:

1. **Given** I am viewing a column with tasks, **When** I look at the column, **Then** I see task cards displayed in that column
2. **Given** I have a task with a title, **When** I view the task card in a column, **Then** I see the task title displayed
3. **Given** I have a task with subtasks, **When** I view the task card, **Then** I see the total number of subtasks
4. **Given** I have a task with completed and incomplete subtasks, **When** I view the task card, **Then** I see how many subtasks are completed (e.g., "3/5 subtasks completed")
5. **Given** I have multiple tasks in a column, **When** I view the column, **Then** I see all task cards stacked vertically

---

### User Story 6 - Toggle Between Light and Dark Mode (Priority: P3)

As a user, I want to switch between light and dark themes so that I can work comfortably in different lighting conditions and according to my preference.

**Why this priority**: Theme switching is a quality-of-life feature that improves user comfort but is not essential for core functionality. Users can work effectively in either mode, making this a lower priority enhancement.

**Independent Test**: Can be fully tested by viewing the application in light mode, toggling to dark mode via the sidebar control, and verifying all UI elements adapt to the new theme. This delivers personalized visual experience.

**Acceptance Scenarios**:

1. **Given** I am using the application, **When** I view the sidebar, **Then** I see a toggle control for light/dark mode
2. **Given** I am in light mode, **When** I toggle to dark mode, **Then** the entire application switches to dark theme
3. **Given** I am in dark mode, **When** I toggle to light mode, **Then** the entire application switches to light theme
4. **Given** I change the theme, **When** I refresh the page or return later, **Then** my theme preference is remembered and applied
5. **Given** I switch themes, **When** the theme changes, **Then** all UI elements (boards, tasks, columns, sidebar) update to match the new theme

---

### Edge Cases

- What happens when a user tries to delete the last remaining board?
- How does the system handle a task with no subtasks when displaying subtask counts?
- What happens when a user drags a task but releases it outside any column?
- How does the system handle very long task titles in task cards?
- What happens when a user creates a board with no name?
- How does the system handle a column with no color indicator set?
- What happens when a user tries to move a task to a non-existent column?
- How does the system handle rapid theme toggling?
- What happens when a task has 0 subtasks completed out of 0 total subtasks?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create new Kanban boards with a name
- **FR-002**: System MUST display all user boards in a sidebar on the left side of the interface
- **FR-003**: System MUST allow users to select a board from the sidebar to view its content
- **FR-004**: System MUST allow users to delete boards from the sidebar
- **FR-005**: System MUST allow users to create tasks with a title and description
- **FR-006**: System MUST allow users to add subtasks to a task, where each subtask is a checkbox item
- **FR-007**: System MUST allow users to mark subtasks as complete or incomplete using checkboxes
- **FR-008**: System MUST track and display the overall status of each task (separate from subtask completion). Task status is derived from the column name where the task is located (e.g., column "Todo" → status "todo", column "Doing" → status "doing", column "Done" → status "done"). Status values are: "todo", "doing", "done" (lowercase, matching column names).
- **FR-009**: System MUST organize tasks into columns within a board
- **FR-010**: System MUST support drag and drop functionality to move tasks between columns
- **FR-011**: System MUST display a color indicator for each column. The color indicator is a colored circle (diameter: 15px) displayed at the top of each column header, using the column's assigned color. The exact visual specification is defined in the Figma design system (see ui-design.md).
- **FR-012**: System MUST allow users to change the color of each column's indicator
- **FR-013**: System MUST display task cards in columns showing: task title, total subtask count, and completed subtask count
- **FR-014**: System MUST provide a light mode theme for the application
- **FR-015**: System MUST provide a dark mode theme for the application
- **FR-016**: System MUST provide a toggle control in the sidebar to switch between light and dark modes
- **FR-017**: System MUST persist theme preference across sessions
- **FR-018**: System MUST apply the selected theme to all UI elements (boards, tasks, columns, sidebar)

### Key Entities *(include if feature involves data)*

- **Board**: Represents a Kanban board container. Has a name, contains multiple columns, belongs to a user, can be created, selected, and deleted.

- **Column**: Represents a workflow stage within a board. Has a name, a color indicator, contains multiple tasks, belongs to a board, tasks can be moved between columns via drag and drop.

- **Task**: Represents a work item. Has a title, description, overall status, contains multiple subtasks, belongs to a column, can be moved between columns.

- **Subtask**: Represents a sub-item within a task. Has a description/text, has a completion status (checked/unchecked), belongs to a task.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new board and see it in the sidebar within 2 seconds of clicking "Create Board" (measured from click to sidebar update)
- **SC-002**: Users can successfully drag and drop a task between columns with 100% accuracy (task appears in correct destination column, position is preserved or updated correctly)
- **SC-003**: Users can view task summary information (title, subtask counts) on task cards without opening the task detail view
- **SC-004**: Users can toggle between light and dark mode and see the theme change applied across all UI elements within 500ms (measured from toggle click to visual update completion)
- **SC-005**: 95% of users can complete their first board creation and task addition workflow without assistance
- **SC-006**: System maintains theme preference across browser sessions for 100% of users who set a preference
- **SC-007**: Task cards display correctly formatted subtask information (e.g., "3 of 5 subtasks") for all tasks with subtasks
- **SC-008**: Users can customize column colors and see changes persist when viewing the board later

## Assumptions

- Users work with a single account (no multi-user collaboration in initial version)
- Boards are stored locally or in user's account (persistence mechanism not specified)
- Default board structure includes at least one column (e.g., "To Do", "In Progress", "Done")
- Color indicators are selected from a predefined palette or color picker
- Task status updates automatically when moved between columns (status maps to column)
- Subtask checkboxes are binary (complete or incomplete, no partial states)
- Theme toggle is a simple two-state control (light/dark, no custom themes initially)
- Sidebar is always visible on the left side of the interface
- Task cards show summary information only; full task details require opening the task
