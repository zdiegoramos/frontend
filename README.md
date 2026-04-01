# Stack

A modern full-stack Next.js starter.

## Tech Stack

| Category   | Technology                     |
| ---------- | ------------------------------ |
| Framework  | Next.js 16 + React 19          |
| Language   | TypeScript 6                   |
| Styling    | Tailwind CSS v4                |
| Components | shadcn/ui + Base UI            |
| Database   | PostgreSQL + Drizzle ORM       |
| API        | oRPC (type-safe RPC)           |
| Forms      | TanStack Form + Zod v4         |
| Tables     | TanStack Table                 |
| PWA        | Serwist (Turbopack)            |
| Testing    | Vitest                         |
| Linting    | Biome + Ultracite              |

## Setup

```bash
bun install
bun db
bun dev
```

## Database

```bash
bun db          # start (or resume) postgres container
bun db status   # show container status
bun db reset    # fresh database
bun db down     # stop and remove container
bun db:studio   # open Drizzle Studio
bun db:generate # generate migrations after schema changes
bun db:migrate  # apply migrations
```

## Other Commands

```bash
bun run build  # production build
bun typecheck  # type checking
bun check      # lint + typecheck
bun test       # run tests
```
