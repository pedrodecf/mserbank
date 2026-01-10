# Cursor Rules – MSERBank Project

## Source of Truth
- The official project requirements are located at:
  - docs/docs/requirements/*.md
- Project issues are mirrored as Markdown files in:
  - /docs/issues
- GitHub issues (github.com/pedrodecf/mserbank/issues) are references only.
  The Markdown files inside /docs/issues are the authoritative source.

## Scope Control
- Do NOT assume implicit requirements.
- Do NOT implement features that are not explicitly described in:
  - The issue Markdown file, or
  - The official requirement documents (docs/requirements).
- If a requirement is ambiguous or missing, ask before proceeding.

## Acceptance Criteria
- Always use the acceptance criteria defined in each issue as the source of truth.
- A task is considered complete only when all acceptance criteria are met.
- Prefer simple, explicit solutions over overengineering.

## Technology Stack (Mandatory)
- Backend framework: NestJS
- Validation: Zod
- ORM: Prisma
- Database: PostgreSQL
- Messaging: RabbitMQ
- Cache: Redis
- API Documentation: Swagger (OpenAPI)
- Containerization: Docker and Docker Compose

Do NOT introduce new technologies or libraries unless explicitly requested.

## Architecture & Design
- Follow Clean Architecture principles where applicable.
- Apply SOLID, KISS, DRY, and YAGNI.
- Maintain clear separation of concerns:
  - Controllers
  - Services
  - Domain / Business logic
  - Infrastructure
- Prefer dependency injection and testable components.

## API Design
- Follow RESTful conventions.
- Use clear, consistent naming for endpoints and DTOs.
- Validate all inputs using Zod.
- Return appropriate HTTP status codes.
- Handle errors explicitly and consistently.

## Messaging & Async Communication
- Use RabbitMQ for asynchronous communication between services.
- Prefer event-driven patterns.
- Ensure loose coupling between producers and consumers.
- Messaging contracts must be explicit and documented.

## Data & Persistence
- Use Prisma as the only ORM.
- Prefer migrations over manual schema changes.
- Avoid business logic inside controllers.
- Use Redis only for cache (no source of truth).

## Testing
- Write unit tests for business logic when relevant.
- Write integration tests for critical flows.

## Documentation
- Keep README and docs updated when introducing changes.
- Document:
  - Architectural decisions
  - API endpoints
  - Messaging events
- Swagger must reflect the actual API behavior.

## Git & Workflow
- One feature per branch.
- Use clear, descriptive commit messages.
- Open a Pull Request when a feature is completed.

## AI Usage Guidelines
- AI is used as a productivity tool, not as an authority.
- All generated code must be reviewed and adjusted.
- Prefer correctness and clarity over verbosity.
