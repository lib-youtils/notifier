Create a monorepo in the current directory with the following specifications:

## Tooling
- Package manager: pnpm (with workspaces)
- Build system: Turborepo
- Language: TypeScript (strict mode) across all packages
- Path alias imports must be configured in each app's tsconfig.json (e.g. `@/*` → `src/*`)

## Repository Structure

apps/
core/      # Node.js + Express API
web/        # React + Tailwind CSS frontend
mobile/     # Empty placeholder (gitkeep only)
packages/
tsconfig/   # Shared TypeScript configs


## App Specifications

### apps/core
- Runtime: Node.js
- Framework: Express
- Entry point: `src/index.ts`
- A single health-check route: `GET /health` → `{ status: "ok" }`
- tsconfig path alias: `@/*` → `src/*`

### apps/web
- Framework: React (with Vite)
- Styling: Tailwind CSS v3
- Entry point: `src/main.tsx`
- A minimal landing page that fetches and displays the core health status
- tsconfig path alias: `@/*` → `src/*`

### apps/mobile
- Contains only a `.gitkeep` file — no package.json, no dependencies

## Docker Requirements
Produce **three** Dockerfile files and **one** docker-compose file:

1. `apps/core/Dockerfile` — builds and runs the core service
2. `apps/web/Dockerfile` — builds and serves the web app (use a static server like `serve` or nginx)
3. `docker-compose.yml` (repo root) — runs **both** core and web together with:
   - Named services: `core`, `web`
   - Port mappings: core → 4000:4000, web → 3000:80 (or 3000:3000)
   - A shared network
   - `web` depends on `core`

Each Dockerfile must also be runnable **standalone** (i.e. `docker build` + `docker run` from the app's directory without docker-compose).

## Turborepo Pipeline (turbo.json)
Define tasks:
- `build` — depends on upstream builds
- `dev` — runs all dev servers in parallel
- `lint`

## General Constraints
- Keep everything minimal — no unnecessary dependencies, no boilerplate beyond what's described
- Every package.json must include a `dev` and `build` script
- The root `package.json` must include pnpm workspace config and turbo scripts
- Do not add testing setup, CI config, or environment variable handling unless asked