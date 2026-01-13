# Quickstart: Robust Kanban Board

**Feature**: Robust Kanban Board  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Test Scenarios

### Scenario 1: Create First Board and Add Task

**Given** I am a new user opening the application  
**When** I see the empty state  
**Then** I can click "Create New Board"  
**And** I enter board name "My First Board"  
**And** I click "Create"  
**Then** I see a board with default columns (Todo, Doing, Done)  
**When** I click "+ Add New Task"  
**And** I enter task title "Complete project setup"  
**And** I enter description "Set up development environment"  
**And** I click "Create Task"  
**Then** I see the task card in the "Todo" column  
**And** The task shows "0 of 0 substasks"

**Expected Result**: Board created, task added to Todo column, task card displays correctly

---

### Scenario 2: Add Subtasks and Mark Complete

**Given** I have a task "Complete project setup" in Todo column  
**When** I click on the task card  
**Then** I see the task detail modal  
**When** I click "Add Subtask"  
**And** I enter "Install dependencies"  
**And** I click "Add Subtask" again  
**And** I enter "Configure environment variables"  
**And** I click "Add Subtask" again  
**And** I enter "Run initial tests"  
**Then** I see 3 subtasks listed  
**When** I check the checkbox for "Install dependencies"  
**Then** The subtask shows as completed (strikethrough)  
**And** The task card shows "1 of 3 substasks"  
**When** I check "Configure environment variables"  
**Then** The task card shows "2 of 3 substasks"

**Expected Result**: Subtasks added, completion tracked, task card updates with progress

---

### Scenario 3: Drag and Drop Task Between Columns

**Given** I have a task "Complete project setup" in Todo column  
**And** The task has 2 of 3 subtasks completed  
**When** I drag the task card  
**Then** I see visual feedback (opacity change, cursor change)  
**When** I drag it over the "Doing" column  
**Then** I see a drop zone indicator  
**When** I release the task  
**Then** The task appears in the "Doing" column  
**And** The task status updates to "doing"  
**And** The task card still shows "2 of 3 substasks"  
**And** The task is removed from "Todo" column

**Expected Result**: Task moved successfully, status updated, visual feedback provided

---

### Scenario 4: Customize Column Color

**Given** I am viewing a board with columns  
**When** I click on a column header  
**Then** I see column options menu  
**When** I click "Edit Column"  
**Then** I see column edit modal  
**When** I click on the color indicator  
**Then** I see color picker with predefined colors  
**When** I select color #EA5555 (red)  
**And** I click "Save"  
**Then** The column header shows red color indicator  
**And** The color persists when I refresh the page

**Expected Result**: Column color updated, persisted, visible in UI

---

### Scenario 5: Toggle Dark Mode

**Given** I am using the application in light mode  
**When** I look at the sidebar  
**Then** I see the theme toggle at the bottom  
**When** I click the theme toggle  
**Then** The entire application switches to dark mode  
**And** Background colors change to dark palette  
**And** Text colors change to light colors  
**And** All UI elements adapt to dark theme  
**When** I refresh the page  
**Then** The dark mode preference is maintained  
**When** I toggle back to light mode  
**Then** The application switches back to light mode

**Expected Result**: Theme toggle works, all components adapt, preference persists

---

### Scenario 6: Create Multiple Boards

**Given** I have one board "My First Board"  
**When** I click "+ Create New Board" in sidebar  
**And** I enter board name "Marketing Campaign"  
**And** I click "Create"  
**Then** I see "Marketing Campaign" in the board list  
**And** The new board becomes active  
**When** I click on "My First Board" in sidebar  
**Then** I see "My First Board" content  
**And** The board I was viewing is preserved

**Expected Result**: Multiple boards created, switching works, each board maintains state

---

### Scenario 7: Delete Board

**Given** I have multiple boards  
**When** I hover over a board name in sidebar  
**Then** I see delete option  
**When** I click delete  
**Then** I see confirmation modal "Delete Board?"  
**When** I click "Delete" in modal  
**Then** The board is removed from sidebar  
**And** I am shown a different board (or empty state if last board)  
**When** I try to delete the last remaining board  
**Then** I see error "Cannot delete last board"

**Expected Result**: Board deleted, confirmation shown, last board protected

---

### Scenario 8: Edit Task Details

**Given** I have a task "Complete project setup"  
**When** I click on the task card  
**Then** I see task detail modal  
**When** I click "Edit Task"  
**Then** I see task edit form  
**When** I change title to "Complete project setup and testing"  
**And** I update description  
**And** I click "Save Changes"  
**Then** The task card shows updated title  
**And** The task detail modal shows updated information

**Expected Result**: Task edited, changes saved, UI updates reflect changes

---

### Scenario 9: Empty Board State

**Given** I have a board with no tasks  
**When** I view the board  
**Then** I see columns with headers  
**And** I see "+ New Column" button  
**And** Columns show "0" task count  
**When** I click "+ Add New Task"  
**Then** I see add task modal  
**When** I create a task  
**Then** The task appears in the selected column

**Expected Result**: Empty state handled gracefully, adding tasks works

---

### Scenario 10: Sidebar Hide/Show

**Given** I am viewing a board with sidebar visible  
**When** I click "Hide Sidebar" at bottom of sidebar  
**Then** The sidebar collapses/hides  
**And** The board content expands to full width  
**When** I click the show sidebar button (if available)  
**Then** The sidebar reappears  
**And** The board content adjusts

**Expected Result**: Sidebar toggle works, layout adjusts, state persists

## Integration Test Checklist

- [ ] Board creation and persistence
- [ ] Task creation and display
- [ ] Subtask creation and completion
- [ ] Drag and drop functionality
- [ ] Column color customization
- [ ] Theme toggle and persistence
- [ ] Multiple board management
- [ ] Board deletion with confirmation
- [ ] Task editing
- [ ] Empty state handling
- [ ] Sidebar visibility toggle
- [ ] Data persistence across page refresh
- [ ] Error handling (validation, storage errors)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

## Performance Test Scenarios

### Load Test
- [ ] Board with 100 tasks loads in <2 seconds
- [ ] Board with 10 columns displays correctly
- [ ] Task with 20 subtasks opens modal in <500ms

### Interaction Test
- [ ] Drag and drop responds within 100ms
- [ ] Theme toggle applies changes within 500ms
- [ ] Task creation completes within 200ms
- [ ] Board switching completes within 300ms

### Stress Test
- [ ] Application handles 1000 boards (storage limit)
- [ ] Board with 100 tasks remains responsive
- [ ] Rapid drag and drop operations don't cause errors
