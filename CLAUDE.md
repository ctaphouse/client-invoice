# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A CRUD web app for managing client invoicing data, replacing a legacy MS Access (.accdb) database. Data lives in a local SQLite file at `data/output/clientinvoice.sqlite`. The app runs entirely on localhost — no remote deployment.

## Commands

| Task | Command |
|---|---|
| Run server (with auto-build) | `bun run server` or `bun run src/server.ts [db-path]` |
| Run server (watch mode) | `bun run server:dev` |
| Build UI only | `bun run build` |
| One-click launch (Windows) | `client-invoice.bat` |
| Run tests | `bun test` |
| Run single test | `bun test <file-or-pattern>` |
| Type check | `bunx tsc --noEmit` |
| Access→SQLite one-time convert | `bun start <input.accdb> <output.sqlite> [--verbose] [--password <pw>]` |
| Apply table/column renames | `bun run scripts/apply-renames.ts` |

The server auto-builds CSS and JS into `dist/` on startup if the bundle is missing or `NODE_ENV` is not `production`. Default port is 3000 (override via `PORT` env var).

## Architecture

### Two entry points

- **`src/index.ts`** — one-time CLI to convert an Access `.accdb` into SQLite. Reads via a 32-bit PowerShell script (`scripts/read-access.ps1`) that uses ADODB/ACE OLEDB, maps ADO types to SQLite affinities (`src/transform/types.ts`), and writes via `bun:sqlite` (`src/writer/sqlite.ts`).
- **`src/server.ts`** — Hono HTTP server that serves the React UI and a REST API backed by the same SQLite file.

### API layer (`src/api/`)

- **`db.ts`** — singleton `bun:sqlite` connection; generic CRUD helpers (`listRows`, `getRow`, `insertRow`, `updateRow`, `deleteRow`). Auto-generates integer PKs via `MAX(pk)+1`.
- **`tableConfig.ts`** — central registry of all 8 tables. Each `TableConfig` defines `tableName`, `apiRoute`, `pk`, `labelColumn`, `sensitiveFields`, and `fks` (foreign key refs). Adding a new table means adding an entry here — routes and UI are generated automatically.
- **`routes/index.ts`** — loops over `TABLE_CONFIGS` to mount `GET/POST/PUT/DELETE /api/{route}` for every table. Also mounts `/api/backup` (VACUUM INTO `data/backups/`, keeps last 10) and `/api/shutdown`. Enforces referential integrity on delete via reverse FK lookup.
- **`middleware/maskFields.ts`** — replaces sensitive field values with `●●●●●` in list/get responses (opt out with `?masked=false`).

### UI (`src/ui/`)

Single-page React app (no router — uses `location.hash` for navigation). Bun builds it to `dist/bundle.js`.

- **`App.tsx`** — fetches `/api/{route}/schema` for each table, renders `Sidebar` + `TablePage`.
- **`components/TablePage.tsx`** — data grid page with search, FK dropdown filters, create/edit/delete. Resolves FK IDs to human-readable labels by fetching referenced tables.
- **`components/DataGrid.tsx`** — renders the table rows.
- **`components/RecordModal.tsx`** / **`FieldInput.tsx`** — form modal for create/edit.
- **`labels.ts`** — display names for nav items, singular forms, and column headers.

### Data flow for FK resolution

Tables with `fks` in their config trigger parallel fetches of referenced tables. The UI builds `fkLabels` (id→display string maps) and `fkOptions` (dropdown choices) from those responses, used for both grid display and form selects.

## Key Conventions

- All table PKs are named `Id` (renamed from Access-style `ClientID`, etc. via `scripts/apply-renames.ts`).
- FK columns retain their original names (e.g., `ClientID` in `LineItem` references `Client.Id`).
- Table names are PascalCase in SQLite, camelCase for API routes.
- Styling is Tailwind CSS v4, built via `@tailwindcss/cli`.
- The Access reader requires the 32-bit ACE OLEDB driver and uses 32-bit PowerShell (`SysWOW64`).
