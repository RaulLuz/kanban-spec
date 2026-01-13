<!--
Sync Impact Report:
Version change: 1.0.0 → 1.1.0 (MINOR - added UX consistency and performance principles)
Modified principles: N/A
Added sections: 
  - Core Principle VI: User Experience Consistency
  - Core Principle VII: Performance Optimization
  - Expanded Quality Standards with UX and Performance sections
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section updated
  ✅ spec-template.md - Aligned (no changes needed)
  ✅ tasks-template.md - Aligned (no changes needed)
Follow-up TODOs: None
-->

# Kanban Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

Every feature MUST follow Test-Driven Development (TDD) workflow: Write tests → User approved → Tests fail → Implement → Tests pass → Refactor. Red-Green-Refactor cycle is strictly enforced. No production code without corresponding tests. Test coverage MUST exceed 80% for all business logic. Tests are first-class citizens and must be maintained with the same rigor as production code.

**Rationale**: Tests provide safety net for refactoring, document expected behavior, and catch regressions early. For a robust Kanban system, reliability is critical.

### II. Clean Code & Single Responsibility

Every function, class, and module MUST have a single, well-defined responsibility. Functions MUST be small (ideally <20 lines, maximum 50 lines). Classes MUST represent a single concept. Code MUST be self-documenting through clear naming. Complex logic MUST be extracted into well-named functions. Magic numbers and strings MUST be constants with descriptive names.

**Rationale**: Clean code reduces cognitive load, improves maintainability, and makes the Kanban system easier to extend and debug.

### III. Domain-Driven Design for Kanban

The codebase MUST reflect Kanban domain concepts explicitly: Board, Column, Card, Task, Workflow, State Transitions. Domain entities MUST be independent of infrastructure concerns. Business rules MUST be encapsulated within domain models. Use clear domain language in code (e.g., `Card.moveToColumn()` not `updateCardPosition()`).

**Rationale**: Kanban has well-defined domain concepts. Expressing them clearly in code makes the system intuitive and maintainable.

### IV. Automated Testing Pyramid

Testing strategy MUST follow pyramid structure: Many unit tests (fast, isolated), fewer integration tests (component interactions), minimal end-to-end tests (critical user journeys). Unit tests MUST run in milliseconds. Integration tests MUST cover API contracts and database interactions. E2E tests MUST validate complete Kanban workflows (create board, add card, move card, delete card).

**Rationale**: Balanced test pyramid ensures fast feedback while maintaining confidence in system behavior. Critical for rapid development of a robust Kanban system.

### V. Code Quality & Maintainability

Code MUST pass static analysis (linters, type checkers) with zero warnings. Code reviews MUST verify adherence to clean code principles. Technical debt MUST be tracked and addressed in each sprint. Refactoring MUST be continuous, not deferred. Documentation MUST be kept in sync with code changes.

**Rationale**: High code quality reduces bugs, improves velocity, and ensures the Kanban system remains robust as it scales.

### VI. User Experience Consistency

All user-facing features MUST maintain consistent interaction patterns, visual design, and behavior across the entire Kanban application. UI components MUST follow established design system and component library. User actions MUST provide immediate visual feedback (loading states, success/error indicators). Error messages MUST be user-friendly, actionable, and consistent in tone. Navigation patterns MUST be predictable and follow established conventions. Accessibility standards (WCAG 2.1 Level AA) MUST be met for all interactive elements.

**Rationale**: Consistent UX reduces cognitive load, improves usability, and creates a professional, trustworthy experience. Users should feel at home in any part of the Kanban system.

### VII. Performance Optimization

All features MUST meet defined performance targets before release. Frontend interactions MUST respond within 100ms for user actions (click, type, drag). API endpoints MUST respond within 200ms for typical operations (p95). Page loads MUST complete initial render within 1 second. Database queries MUST be optimized with proper indexing. Large datasets MUST use pagination or virtualization. Images and assets MUST be optimized and lazy-loaded. Performance budgets MUST be defined and monitored. Performance regressions MUST be caught by automated tests.

**Rationale**: Performance directly impacts user satisfaction and productivity. A slow Kanban system frustrates users and reduces adoption. Performance is a feature, not an afterthought.

## Development Workflow

### Test-Driven Development Process

1. **Red**: Write failing test that describes desired behavior
2. **Green**: Write minimal code to make test pass
3. **Refactor**: Improve code quality while keeping tests green
4. **Repeat**: Continue cycle for each feature increment

### Code Review Requirements

- All code MUST be reviewed before merge
- Reviewers MUST verify test coverage and quality
- Reviewers MUST check adherence to clean code principles
- Reviewers MUST validate domain model consistency
- Reviewers MUST verify UX consistency with design system
- Reviewers MUST check performance impact and optimization
- PRs failing tests or linting MUST be rejected
- PRs causing performance regressions MUST be rejected

### Quality Gates

- All tests MUST pass before merge
- Code coverage MUST exceed 80% for business logic
- Static analysis MUST pass with zero warnings
- Integration tests MUST pass for affected features
- Performance tests MUST pass (no regressions)
- UX review MUST verify design system compliance
- Accessibility checks MUST pass (WCAG 2.1 AA)
- Documentation MUST be updated for public APIs

## Quality Standards

### Testing Requirements

- **Unit Tests**: Test individual functions and classes in isolation
- **Integration Tests**: Test component interactions and database operations
- **Contract Tests**: Test API endpoints match specifications
- **E2E Tests**: Test complete user workflows through the Kanban interface
- **Performance Tests**: Test system behavior under expected load

### Code Standards

- **Naming**: Use descriptive names that reveal intent (e.g., `calculateCardPosition()` not `calc()`)
- **Functions**: Single responsibility, small size, pure when possible
- **Classes**: Single responsibility, high cohesion, loose coupling
- **Comments**: Explain "why" not "what" - code should be self-documenting
- **DRY**: Don't Repeat Yourself - extract common patterns
- **YAGNI**: You Aren't Gonna Need It - avoid premature optimization

### Kanban-Specific Standards

- **State Management**: Card state transitions MUST be explicit and validated
- **Concurrency**: Board operations MUST handle concurrent updates safely
- **Data Integrity**: Card positions and column relationships MUST remain consistent
- **Performance**: Board operations MUST complete in <200ms for typical workloads (p95)
- **Scalability**: System MUST support 1000+ boards with 100+ cards each
- **UX Consistency**: Drag-and-drop behavior MUST be consistent across all boards
- **Visual Feedback**: Card movements MUST show smooth animations (<60fps)
- **Real-time Updates**: Board changes MUST sync across users within 500ms

### User Experience Standards

- **Design System**: All UI components MUST use shared design tokens (colors, spacing, typography)
- **Interaction Patterns**: Similar actions MUST behave consistently (e.g., all modals close the same way)
- **Feedback**: User actions MUST show immediate visual feedback (hover states, loading indicators)
- **Error Handling**: Error messages MUST be contextual, helpful, and guide users to resolution
- **Accessibility**: All interactive elements MUST be keyboard navigable and screen-reader friendly
- **Responsive Design**: Interface MUST work seamlessly across desktop, tablet, and mobile viewports
- **Internationalization**: Text MUST be externalized for future translation support

### Performance Standards

- **Frontend Performance**:
  - Initial page load: <1 second (First Contentful Paint)
  - Time to Interactive: <2 seconds
  - User interactions: <100ms response time
  - Smooth animations: 60fps for drag-and-drop operations
  - Bundle size: Monitor and optimize JavaScript payloads

- **Backend Performance**:
  - API response time: <200ms (p95) for typical operations
  - Database queries: <50ms (p95) with proper indexing
  - Concurrent users: Support 1000+ simultaneous users per board
  - Real-time sync: <500ms latency for board updates

- **Performance Monitoring**:
  - Performance budgets MUST be defined per feature
  - Performance metrics MUST be tracked in production
  - Performance regressions MUST fail CI/CD pipeline
  - Load testing MUST be performed before major releases

## Governance

This constitution supersedes all other development practices. All PRs and code reviews MUST verify compliance with these principles. Violations MUST be addressed before merge approval. Amendments to this constitution require:

1. Documentation of rationale for change
2. Impact analysis on existing codebase
3. Team approval
4. Version increment following semantic versioning
5. Update to dependent templates and documentation

Complexity that violates these principles MUST be justified in plan.md Complexity Tracking section. Use `.specify/memory/constitution.md` for runtime development guidance.

**Version**: 1.1.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
