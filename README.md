# Kanban Board Application

A robust Kanban board application built with Next.js 14, TypeScript, Tailwind CSS, and SQLite.

## Features

- ✅ **Multiple Boards**: Create, manage, and switch between multiple Kanban boards
- ✅ **Task Management**: Create tasks with titles, descriptions, and subtasks
- ✅ **Subtask Tracking**: Add subtasks to tasks and track completion progress
- ✅ **Drag and Drop**: Organize tasks by dragging them between columns
- ✅ **Column Customization**: Customize column names and colors
- ✅ **Light/Dark Mode**: Toggle between light and dark themes
- ✅ **Persistent Storage**: SQLite database for data persistence

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Database**: SQLite (better-sqlite3) with Drizzle ORM
- **Drag & Drop**: @dnd-kit
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kanban
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# .env.local is already created with DATABASE_PATH=./data/kanban.db
```

4. Run database migrations (automatic on first run):
```bash
# Migrations run automatically on server start
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
kanban/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # React components
│   │   ├── board/        # Board-related components
│   │   ├── modals/       # Modal components
│   │   ├── providers/    # Context providers
│   │   ├── task/         # Task-related components
│   │   └── ui/           # Reusable UI components
│   ├── lib/
│   │   ├── db/           # Database configuration
│   │   ├── hooks/       # Custom React hooks
│   │   ├── models/      # Domain models
│   │   ├── services/    # Business logic services
│   │   ├── styles/      # Theme and design tokens
│   │   └── utils/       # Utility functions
│   └── types/           # TypeScript type definitions
├── tests/               # Test files
│   ├── e2e/            # E2E tests
│   ├── integration/    # Integration tests
│   └── unit/           # Unit tests
├── data/               # SQLite database files
└── specs/              # Specification documents
```

## Database

The application uses SQLite for data persistence. The database file is stored in `./data/kanban.db` (development) and is automatically created on first run.

### Schema

- **boards**: Stores board information
- **columns**: Stores column information (belongs to board)
- **tasks**: Stores task information (belongs to column and board)
- **subtasks**: Stores subtask information (belongs to task)
- **theme_preferences**: Stores user theme preference

## Features Overview

### Boards
- Create multiple boards
- Switch between boards
- Delete boards (with protection for last board)
- Board list in sidebar

### Tasks
- Create tasks with title and description
- Add subtasks to tasks
- Track subtask completion
- Move tasks between columns via drag and drop
- View task details in modal
- Edit tasks

### Columns
- Default columns: Todo, Doing, Done
- Customize column names
- Customize column colors
- Drag and drop tasks between columns

### Theme
- Light and dark mode
- Theme preference persisted in database
- Toggle in sidebar

## Testing

The project follows Test-Driven Development (TDD) principles:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and service interactions
- **E2E Tests**: Test complete user workflows

Run all tests:
```bash
npm test
```

## Performance

- API response times: <200ms (p95)
- Page load: <1s (First Contentful Paint)
- Drag and drop interactions: <100ms
- Smooth 60fps animations

## Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader support
- ARIA labels on interactive elements

## License

MIT
