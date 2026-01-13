# UI Design: Robust Kanban Board

**Figma File**: [Y21VMIMjSNvHqbOFb56JZK](https://www.figma.com/design/Y21VMIMjSNvHqbOFb56JZK/kanban-task-management-web-app)
**Design System Node**: 0:9066
**Board Layout Node**: 0:8800

## Design System

### Colors

#### Primary Colors
- **Main Purple**: `#635FC7` (RGB: 99, 95, 199 | HSL: 242°, 48%, 58%)
- **Main Purple Hover**: `#A8A4FF` (RGB: 168, 164, 255 | HSL: 243°, 100%, 82%)

#### Neutral Colors (Light Mode)
- **Black**: `#000112` (RGB: 0, 1, 18 | HSL: 237°, 100%, 4%)
- **White**: `#FFFFFF` (RGB: 255, 255, 255 | HSL: 0°, 0%, 100%)
- **Medium Grey**: `#828FA3` (RGB: 130, 143, 163 | HSL: 216°, 15%, 57%)
- **Light Grey (Light BG)**: `#F4F7FD` (RGB: 244, 247, 253 | HSL: 220°, 69%, 97%)
- **Lines (Light)**: `#E4EBFA` (RGB: 228, 235, 250 | HSL: 221°, 69%, 94%)

#### Neutral Colors (Dark Mode)
- **Very Dark Grey (Dark BG)**: `#20212C` (RGB: 32, 33, 44 | HSL: 235°, 16%, 15%)
- **Dark Grey**: `#2B2C37` (RGB: 43, 44, 55 | HSL: 235°, 12%, 19%)
- **Lines (Dark)**: `#3E3F4E` (RGB: 62, 63, 78 | HSL: 236°, 11%, 27%)

#### Accent Colors
- **Red**: `#EA5555` (RGB: 234, 85, 85 | HSL: 0°, 78%, 63%)
- **Red Hover**: `#FF9898` (RGB: 255, 152, 152 | HSL: 0°, 100%, 80%)

### Typography

**Font Family**: Plus Jakarta Sans

#### Headings
- **Heading (XL)**: Bold, 24px, Line Height: 30px, Letter Spacing: 0
- **Heading (L)**: Bold, 18px, Line Height: 23px, Letter Spacing: 0
- **Heading (M)**: Bold, 15px, Line Height: 19px, Letter Spacing: 0
- **Heading (S)**: Bold, 12px, Line Height: 15px, Letter Spacing: 2.4px

#### Body Text
- **Body (L)**: Medium, 13px, Line Height: 23px, Letter Spacing: 0
- **Body (M)**: Bold, 12px, Line Height: 15px, Letter Spacing: 0

### Interactive Elements

#### Buttons
- **Button Primary (L)**: 
  - Idle: `#635FC7`, rounded 24px
  - Hover: `#A8A4FF`
- **Button Primary (S)**: 
  - Idle: `#635FC7`, rounded 20px
  - Hover: `#A8A4FF`
- **Button Secondary**: 
  - Idle: `rgba(99,95,199,0.1)` background, `#635FC7` text, rounded 20px
  - Hover: `rgba(99,95,199,0.25)` background
- **Button Destructive**: 
  - Idle: `#EA5555`, rounded 20px
  - Hover: `#FF9898`

#### Form Elements
- **Text Field**: 
  - Idle: White background, `rgba(130,143,163,0.25)` border, rounded 4px
  - Active: White background, `rgba(130,143,163,0.25)` border
  - Error: White background, `#EA5555` border, error message `#EA5555`
- **Dropdown**: 
  - Idle: Border `rgba(130,143,163,0.25)`, rounded 4px
  - Active: Border `#635FC7`, rounded 4px
- **Subtask Checkbox**: 
  - Idle: `#F4F7FD` background (light) / `#20212C` (dark), white border `rgba(130,143,163,0.25)`, rounded 4px
  - Hover: `#635FC7` opacity 25% background
  - Completed: `#635FC7` background, checkmark icon, text strikethrough opacity 50%

### Component Specifications

#### Sidebar
- Width: 300px
- Background: White (light) / Dark Grey (dark)
- Board list items: Rounded right corners (100px), padding
- Active board: Purple background (`#635FC7`), white text
- Inactive boards: Transparent background, grey text (`#828FA3`)
- Theme toggle: Located at bottom, includes toggle switch

#### Board Header
- Height: 97px
- Background: White (light) / Dark Grey (dark)
- Board title: Heading (XL), Black (light) / White (dark)
- Add New Task button: Button Primary (L)

#### Column Headers
- Display: Column name + task count
- Format: "COLUMN NAME (COUNT)" in Heading (S) style
- Color indicator: Colored circle/dot next to column name
- Text color: Medium Grey (`#828FA3`)

#### Task Cards
- Background: White (light) / Dark Grey (dark)
- Border radius: 8px
- Shadow: `0px 4px 6px rgba(54,78,126,0.1)`
- Padding: Internal spacing for title and subtask info
- Title: Heading (M), Black (light) / White (dark)
- Subtask info: Body (M), Medium Grey (`#828FA3`)
- Format: "X of Y substasks"

#### New Column Button
- Background: Gradient from `#E9EFFA` to `rgba(233,239,250,0.5)`
- Border radius: 6px
- Text: Heading (XL), Medium Grey (`#828FA3`), centered
- Text: "+ New Column"

## Layout Structure

### Desktop Layout
- **Sidebar**: Fixed left, 300px width
- **Main Content**: Starts at 300px, full remaining width
- **Board Area**: Horizontal scrollable columns
- **Column Width**: Flexible, minimum width based on content

### Responsive Considerations
- Sidebar can be hidden/shown
- Board columns scroll horizontally when content exceeds viewport
- Task cards stack vertically within columns

## Dark Mode Implementation

All components have dark mode variants:
- Backgrounds switch to dark palette (`#20212C`, `#2B2C37`)
- Text switches to white/light grey
- Borders and lines use dark mode colors (`#3E3F4E`)
- Interactive elements maintain same hover states with adjusted colors

## Design Tokens Summary

```typescript
// Colors
const colors = {
  primary: {
    main: '#635FC7',
    hover: '#A8A4FF',
  },
  neutral: {
    black: '#000112',
    white: '#FFFFFF',
    mediumGrey: '#828FA3',
    lightGrey: '#F4F7FD',
    linesLight: '#E4EBFA',
    veryDarkGrey: '#20212C',
    darkGrey: '#2B2C37',
    linesDark: '#3E3F4E',
  },
  accent: {
    red: '#EA5555',
    redHover: '#FF9898',
  },
};

// Typography
const typography = {
  headingXL: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '30px',
    letterSpacing: '0',
  },
  headingL: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '23px',
    letterSpacing: '0',
  },
  headingM: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 700,
    fontSize: '15px',
    lineHeight: '19px',
    letterSpacing: '0',
  },
  headingS: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '15px',
    letterSpacing: '2.4px',
  },
  bodyL: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '23px',
    letterSpacing: '0',
  },
  bodyM: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '15px',
    letterSpacing: '0',
  },
};
```

## Modal Components Reference

- **View Task**: node-id=0:8655
- **Add Task**: node-id=0:8500
- **Edit Task**: node-id=0:8345
- **Add Board**: node-id=0:8200
- **Edit Board**: node-id=0:8052
- **Delete Board**: node-id=0:7925
- **Delete Task**: node-id=0:7798

## Board States Reference

- **Board Empty**: node-id=0:8951
- **Board Sidebar Hidden**: node-id=0:8912
- **Board Sidebar Visible with Tasks**: node-id=0:8800
