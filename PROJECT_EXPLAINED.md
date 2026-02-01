# BEN10 Project Documentation

## 1) Project Overview
BEN10 is a Next.js 15 App Router project that builds a lightweight n8n-style workflow editor and execution engine. Users can sign up, create workflows, edit them visually using a node-based editor, and execute them via an event-driven backend (Inngest). The backend uses Prisma with PostgreSQL and tRPC for type-safe API calls. Billing and subscription gating is integrated via Polar and Better Auth. Sentry is configured for error monitoring across server, edge, and client.

The app is split into three main areas:
- Auth pages: login/register flows.
- Dashboard area: workflow list, credentials, executions, and the workflow editor.
- API layer: tRPC, auth, Inngest functions, and Sentry example routes.

## 2) Tech Stack

### Frontend
- Next.js 15.5.4 (App Router, RSC + client components)
- React 19
- TypeScript
- Tailwind CSS v4 + tw-animate-css
- Shadcn UI (Radix UI primitives + custom wrappers)
- React Flow (@xyflow/react) for node graph editor
- React Hook Form + Zod for forms
- Jotai for editor instance state
- TanStack React Query for caching, async data
- Nuqs for URL query state (pagination/search)
- Sonner for toast notifications
- Lucide icons

### Backend
- tRPC v11 for typed API endpoints
- Prisma ORM for PostgreSQL
- Inngest for event-driven workflow execution
- Better Auth for auth + sessions

### Billing/Subscriptions
- Polar (SDK + Better Auth plugin)

### Observability
- Sentry (server, edge, client, and example API/page)

### Tooling
- Biome for lint/format
- Prisma config for migrations

## 3) Scripts
Defined in `package.json`:
- `npm run dev`: Next dev server with Turbopack
- `npm run build`: Next build with Turbopack
- `npm run start`: Next start
- `npm run lint`: Biome check
- `npm run format`: Biome format

## 4) Project Structure (Top-Level)
```
.
├─ src/                       # Application source
├─ prisma/                    # Prisma schema + migrations
├─ public/                    # Static assets
├─ node_modules/              # Installed dependencies
├─ next.config.ts             # Next + Sentry config
├─ sentry.edge.config.ts      # Sentry edge config
├─ sentry.server.config.ts    # Sentry server config
├─ src/instrumentation.ts     # Sentry instrumentation
├─ src/instrumentation-client.ts # Sentry client setup
├─ package.json               # Dependencies + scripts
├─ biome.json                 # Biome config
├─ components.json            # Shadcn UI config
└─ tsconfig.json              # TypeScript config
```

## 5) Important Config Files

### `next.config.ts`
- Disables dev indicators.
- Redirects `/` to `/workflows`.
- Wrapped with Sentry config (org: `pixelorcode`, project: `ben10`).
- Enables Sentry tunnel route at `/monitoring`.

### `components.json`
- Shadcn UI setup (New York style).
- Tailwind base is `src/app/globals.css`.
- Alias mappings for `@/components`, `@/lib`, `@/hooks`.

### `src/app/globals.css`
- Tailwind v4 setup with custom CSS variables.
- Light/dark theme variables.
- Base styles and React Flow node selection styles.

### `prisma.config.ts`
- Prisma schema at `prisma/schema.prisma`.
- Migrations in `prisma/migrations`.
- Reads `DATABASE_URL`.

## 6) App Routing (App Router)

### Root layout
`src/app/layout.tsx`
- Applies fonts (Geist, Geist Mono) and global CSS.
- Wraps app in:
  - `TRPCReactProvider`
  - `NuqsAdapter`
  - `Jotai Provider`
  - `Toaster` for notifications

### Public Auth Routes
- `/login` -> `src/app/(auth)/login/page.tsx`
- `/register` -> `src/app/(auth)/register/page.tsx`
- Layout uses `AuthLayout` (logo + centered panel).

### Dashboard Routes (protected)
- `/workflows` -> workflows list with search + pagination
- `/workflows/[workflowId]` -> workflow editor
- `/credentials` -> placeholder page
- `/credentials/[credentialId]` -> placeholder page
- `/executions` -> placeholder page
- `/executions/[executionId]` -> placeholder page

Protection is done via `requireAuth()` in server components.

### Other Routes
- `/sentry-example-page` for testing Sentry client-side errors.

## 7) API Routes

### `src/app/api/auth/[...all]/route.ts`
- Better Auth handler for signup/login/session, etc.

### `src/app/api/trpc/[trpc]/route.ts`
- tRPC fetch adapter, serves `appRouter`.

### `src/app/api/inngest/route.ts`
- Inngest Next.js serve handler.
- Registers `executeWorkflow` function.

### `src/app/api/sentry-example-api/route.ts`
- Throws a test error for Sentry backend monitoring.

## 8) tRPC Layer

### `src/trpc/init.ts`
- `createTRPCContext`: currently returns `{ userId: "user_123" }` (placeholder).
- `baseProcedure`: standard tRPC procedure.
- `protectedprocedure`: requires session via Better Auth (`auth.api.getSession`).
- `premiumProcedure`: checks Polar customer subscription state.

### `src/trpc/routers/_app.ts`
- Root router exposes `workflows` router only.

### `src/trpc/server.tsx`
- Creates server-side trpc options proxy for RSC usage.
- `prefetch` helper for React Query prefetching.
- `HydrateClient` for query hydration.

### `src/trpc/client.tsx`
- Client-side TRPC + React Query provider.
- Uses httpBatchLink pointing to `/api/trpc`.

## 9) Auth and Subscription

### Better Auth
`src/lib/auth.ts`
- Prisma adapter (PostgreSQL).
- Email + password auth enabled.
- Auto sign-in after signup.

### Auth Utils
`src/lib/auth-utils.ts`
- `requireAuth`: redirects unauthenticated users to `/login`.
- `requireUnAuth`: redirects authenticated users to `/`.

### Polar Subscription
- `src/lib/polar.ts` creates Polar client.
- `auth` plugin integrates with Polar checkout + portal.
- `useHasActiveSubscription` hook checks active subscription.

### Sidebar Billing Actions
`src/components/app-sidebar.tsx`
- Shows upgrade button when no active subscription.
- Calls `authClient.checkout({ slug: "BEN10-Automation" })`.
- Billing portal button calls `authClient.customer.portal()`.

## 10) Database (Prisma Schema)
Defined in `prisma/schema.prisma`:

### User
- id, name, email, image
- emailVerified, createdAt, updatedAt
- relations: sessions, accounts, workflows

### Session
- auth session data with token, expiry, user info

### Account
- auth provider credentials

### Verification
- tokens for email verification

### Workflow
- id, name, timestamps
- nodes (Node[])
- connections (Connection[])
- userId relation

### Node
- id, workflowId, name, type, position (Json), data (Json)
- relations: outputConnections/inputConnections

### Connection
- fromNodeId -> toNodeId
- fromOutput/toInput
- unique on (fromNodeId, toNodeId, fromOutput, toInput)

### NodeType enum
- INITIAL
- MANUAL_TRIGGER
- HTTP_REQUEST

Generated Prisma client is in `src/generated/prisma` (do not edit manually).

## 11) Workflow Feature (Core of App)

### Router: `src/features/workflows/server/routers.ts`
Key endpoints:
- `create`: creates a workflow + initial node.
- `getMany`: list workflows with pagination + search.
- `getOne`: fetch workflow with nodes + connections, maps to React Flow `Node`/`Edge`.
- `update`: replaces all nodes + connections (transaction).
- `updateName`: rename workflow.
- `remove`: delete workflow.
- `execute`: sends Inngest event `workflows/execute.workflow`.

### Hooks: `src/features/workflows/hooks/use-workflows.ts`
- `useSuspenseWorkflows` and `useSuspenseWorkflow` for data.
- `useCreateWorkflow`, `useUpdateWorkflow`, `useUpdateWorkflowName` for mutations.
- `useExecuteWorkflow` triggers run.

### Params: `src/features/workflows/params.ts`
- URL query parsing via Nuqs (page, pageSize, search).

### Prefetching
`src/features/workflows/server/prefetch.ts`
- Server-side query prefetch for list/editor pages.

## 12) Editor Feature (React Flow)

### `src/features/editor/components/editor.tsx`
- Loads workflow data and renders React Flow graph.
- Tracks nodes/edges in local state.
- Allows drag, connect, and edit.
- Uses `nodeComponents` to map NodeType to React Flow components.

### `src/features/editor/components/editor-header.tsx`
- Breadcrumb with inline rename of workflow.
- Save button serializes graph state to backend.

### `src/features/editor/components/execute-workflow-button.tsx`
- Triggers `workflows.execute` mutation.

### `src/features/editor/store/atoms.ts`
- Stores ReactFlow instance in Jotai atom.

## 13) Node Types

### Initial Node
`src/components/initial-node.tsx`
- Entry placeholder that opens NodeSelector.

### Manual Trigger
`src/features/triggers/components/manual-trigger/node.tsx`
- Trigger node; opens settings dialog.

### HTTP Request
`src/features/executions/components/http-request/node.tsx`
- Execution node; opens HTTP request config dialog.

### Node Selector
`src/components/node-selector.tsx`
- Side sheet for selecting new node types.
- Prevents multiple manual triggers.

### Base Node Components
`src/components/react-flow/*`
- BaseNode, BaseHandle, NodeStatusIndicator, PlaceholderNode.
- Shared styling, handles, and status display.

## 14) Inngest Execution

### Client
`src/inngest/client.ts`
- `new Inngest({ id: "BEN10" })`.

### Function
`src/inngest/functions.ts`
- `executeWorkflow` listens for `workflows/execute.workflow`.
- Loads workflow nodes + connections.
- Sorts nodes topologically using `topologicalSort`.

### Topological Sort
`src/inngest/utils.ts`
- Builds edge list from connections.
- Ensures disconnected nodes are included.
- Detects cycles and throws error.

## 15) UI Components

### Layout + Structure
- `src/components/app-sidebar.tsx`: navigation + billing actions.
- `src/components/app-header.tsx`: top bar with sidebar trigger.
- `src/components/entity-components.tsx`: generic list/search/pagination UI.
- `src/components/upgrade-modal.tsx`: subscription upgrade dialog.

### Shadcn UI Base
All shadcn UI components live in `src/components/ui/*` (Radix-based). Key types:
- Inputs: input, textarea, select, checkbox, radio-group
- Overlays: dialog, sheet, popover, dropdown, tooltip
- Layout: card, table, separator, scroll-area, resizable
- Navigation: breadcrumb, tabs, navigation-menu, sidebar
- Feedback: alert, alert-dialog, toast (sonner)
- Utilities: form, button, badge, skeleton, spinner

## 16) Data Flow (End-to-End)

### 1) Auth Flow
1. User hits `/login` or `/register`.
2. Forms call Better Auth via `authClient.signIn` / `signUp`.
3. Session stored in database using Prisma adapter.
4. Protected pages call `requireAuth()` on server side.

### 2) Workflow List Flow
1. `/workflows` page loads.
2. `workflowsParamsLoader` parses query (page, search).
3. Server prefetches tRPC `workflows.getMany`.
4. Client hydrates React Query and renders list.

### 3) Workflow Editor Flow
1. `/workflows/[workflowId]` loads.
2. Server prefetches `workflows.getOne`.
3. Editor uses React Flow to render nodes/edges.
4. User updates graph; state stays local.
5. Save button sends `workflows.update` mutation.
6. Backend replaces all nodes/edges in a transaction.

### 4) Execution Flow
1. User clicks Execute Workflow.
2. Client calls `workflows.execute` mutation.
3. Backend emits Inngest event `workflows/execute.workflow`.
4. Inngest function loads workflow and performs topological sort.
5. (Future) Execution steps would run in sorted order.

### 5) Subscription Gating
1. Premium actions can use `premiumProcedure`.
2. On FORBIDDEN, `useUpgradeModal` opens upgrade dialog.

## 17) Environment Variables
Required/used env vars:
- `DATABASE_URL`: PostgreSQL connection
- `POLAR_ACCESS_TOKEN`: Polar API access
- `POLAR_SUCCESS_URL`: Redirect after checkout
- `VERCEL_URL`: used to build server URL in tRPC client
- `CI`: used by Sentry config for log verbosity

## 18) Notable Generated/External
- `src/generated/prisma/*`: Generated Prisma client and types.
- `node_modules/`: External dependencies (not edited).

---

## 19) File-by-File Highlights (Key Files)

### Core
- `src/app/layout.tsx`: root providers + fonts
- `src/app/globals.css`: styling + theme tokens
- `src/trpc/init.ts`: auth/protection procedures
- `src/lib/db.ts`: Prisma client singleton
- `src/lib/auth.ts`: Better Auth + Polar integration
- `src/inngest/functions.ts`: workflow execution entrypoint
- `prisma/schema.prisma`: DB models

### Workflow + Editor
- `src/features/workflows/server/routers.ts`: CRUD + execute
- `src/features/workflows/components/workflows.tsx`: list UI
- `src/features/editor/components/editor.tsx`: graph editor
- `src/features/editor/components/editor-header.tsx`: rename + save
- `src/components/node-selector.tsx`: add node flow

### Auth + Billing
- `src/features/auth/components/login-forum.tsx`: login UI
- `src/features/auth/components/register-forum.tsx`: signup UI
- `src/components/upgrade-modal.tsx`: upgrade prompt
- `src/components/app-sidebar.tsx`: billing actions

### Observability
- `src/instrumentation.ts`: Sentry server/edge
- `src/instrumentation-client.ts`: Sentry client
- `src/app/api/sentry-example-api/route.ts`: error test

---

## 20) What This Project Currently Does vs. Placeholder Areas

Implemented and active:
- Auth (email/password)
- Workflow CRUD
- Workflow editor UI
- Node types: Manual Trigger, HTTP Request
- Execution initiation (Inngest event)
- Subscription checks + upgrade modal
- Sentry setup

Placeholders / minimal pages:
- Credentials pages
- Executions pages
- Some root `/` page code (legacy test) does not match current router structure

If you want this document expanded with deeper per-component breakdowns or to add diagrams, tell me which section to focus on.
