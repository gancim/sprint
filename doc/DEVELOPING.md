# Developing

This project can run fully in local dev without setting up PostgreSQL manually.

## Deployment Modes

For mode definitions and intended CLI behavior, see `doc/DEPLOYMENT-MODES.md`.

Current implementation status:

- canonical model: `local_trusted` and `authenticated` (with `private/public` exposure)

## Prerequisites

- Node.js 20+
- pnpm 9+

## Dependency Lockfile Policy

GitHub Actions owns `pnpm-lock.yaml`.

- Do not commit `pnpm-lock.yaml` in pull requests.
- Pull request CI validates dependency resolution when manifests change.
- Pushes to `master` regenerate `pnpm-lock.yaml` with `pnpm install --lockfile-only --no-frozen-lockfile`, commit it back if needed, and then run verification with `--frozen-lockfile`.

## Start Dev

From repo root:

```sh
pnpm install
pnpm dev
```

This starts:

- API server: `http://localhost:3100`
- UI: served by the API server in dev middleware mode (same origin as API)

`pnpm dev` runs the server in watch mode and restarts on changes from workspace packages (including adapter packages). Use `pnpm dev:once` to run without file watching.

`pnpm dev:once` now tracks backend-relevant file changes and pending migrations. When the current boot is stale, the board UI shows a `Restart required` banner. You can also enable guarded auto-restart in `Instance Settings > Experimental`, which waits for queued/running local agent runs to finish before restarting the dev server.

Tailscale/private-auth dev mode:

```sh
pnpm dev --tailscale-auth
```

This runs dev as `authenticated/private` and binds the server to `0.0.0.0` for private-network access.

Allow additional private hostnames (for example custom Tailscale hostnames):

```sh
pnpm sprintai allowed-hostname dotta-macbook-pro
```

## One-Command Local Run

For a first-time local install, you can bootstrap and run in one command:

```sh
pnpm sprintai run
```

`sprintai run` does:

1. auto-onboard if config is missing
2. `sprintai doctor` with repair enabled
3. starts the server when checks pass

## Docker Quickstart (No local Node install)

Build and run Sprint in Docker:

```sh
docker build -t sprint-local .
docker run --name sprint \
  -p 3100:3100 \
  -e HOST=0.0.0.0 \
  -e SPRINT_HOME=/sprint \
  -v "$(pwd)/data/docker-sprint:/sprint" \
  sprint-local
```

Or use Compose:

```sh
docker compose -f docker-compose.quickstart.yml up --build
```

See `doc/DOCKER.md` for API key wiring (`OPENAI_API_KEY` / `ANTHROPIC_API_KEY`) and persistence details.

## Docker For Untrusted PR Review

For a separate review-oriented container that keeps `codex`/`claude` login state in Docker volumes and checks out PRs into an isolated scratch workspace, see `doc/UNTRUSTED-PR-REVIEW.md`.

## Database in Dev (Auto-Handled)

For local development, leave `DATABASE_URL` unset.
The server will automatically use embedded PostgreSQL and persist data at:

- `~/.sprint/instances/default/db`

Override home and instance:

```sh
SPRINT_HOME=/custom/path SPRINT_INSTANCE_ID=dev pnpm sprintai run
```

No Docker or external database is required for this mode.

## Storage in Dev (Auto-Handled)

For local development, the default storage provider is `local_disk`, which persists uploaded images/attachments at:

- `~/.sprint/instances/default/data/storage`

Configure storage provider/settings:

```sh
pnpm sprintai configure --section storage
```

## Default Agent Workspaces

When a local agent run has no resolved project/session workspace, Sprint falls back to an agent home workspace under the instance root:

- `~/.sprint/instances/default/workspaces/<agent-id>`

This path honors `SPRINT_HOME` and `SPRINT_INSTANCE_ID` in non-default setups.

For `codex_local`, Sprint also manages a per-company Codex home under the instance root and seeds it from the shared Codex login/config home (`$CODEX_HOME` or `~/.codex`):

- `~/.sprint/instances/default/companies/<company-id>/codex-home`

## Worktree-local Instances

When developing from multiple git worktrees, do not point two Sprint servers at the same embedded PostgreSQL data directory.

Instead, create a repo-local Sprint config plus an isolated instance for the worktree:

```sh
sprintai worktree init
# or create the git worktree and initialize it in one step:
pnpm sprintai worktree:make sprint-pr-432
```

This command:

- writes repo-local files at `.sprint/config.json` and `.sprint/.env`
- creates an isolated instance under `~/.sprint-worktrees/instances/<worktree-id>/`
- when run inside a linked git worktree, mirrors the effective git hooks into that worktree's private git dir
- picks a free app port and embedded PostgreSQL port
- by default seeds the isolated DB in `minimal` mode from the current effective Sprint instance/config (repo-local worktree config when present, otherwise the default instance) via a logical SQL snapshot

Seed modes:

- `minimal` keeps core app state like companies, projects, issues, comments, approvals, and auth state, preserves schema for all tables, but omits row data from heavy operational history such as heartbeat runs, wake requests, activity logs, runtime services, and agent session state
- `full` makes a full logical clone of the source instance
- `--no-seed` creates an empty isolated instance

After `worktree init`, both the server and the CLI auto-load the repo-local `.sprint/.env` when run inside that worktree, so normal commands like `pnpm dev`, `sprintai doctor`, and `sprintai db:backup` stay scoped to the worktree instance.

That repo-local env also sets:

- `SPRINT_IN_WORKTREE=true`
- `SPRINT_WORKTREE_NAME=<worktree-name>`
- `SPRINT_WORKTREE_COLOR=<hex-color>`

The server/UI use those values for worktree-specific branding such as the top banner and dynamically colored favicon.

Print shell exports explicitly when needed:

```sh
sprintai worktree env
# or:
eval "$(sprintai worktree env)"
```

### Worktree CLI Reference

**`pnpm sprintai worktree init [options]`** — Create repo-local config/env and an isolated instance for the current worktree.

| Option | Description |
|---|---|
| `--name <name>` | Display name used to derive the instance id |
| `--instance <id>` | Explicit isolated instance id |
| `--home <path>` | Home root for worktree instances (default: `~/.sprint-worktrees`) |
| `--from-config <path>` | Source config.json to seed from |
| `--from-data-dir <path>` | Source SPRINT_HOME used when deriving the source config |
| `--from-instance <id>` | Source instance id (default: `default`) |
| `--server-port <port>` | Preferred server port |
| `--db-port <port>` | Preferred embedded Postgres port |
| `--seed-mode <mode>` | Seed profile: `minimal` or `full` (default: `minimal`) |
| `--no-seed` | Skip database seeding from the source instance |
| `--force` | Replace existing repo-local config and isolated instance data |

Examples:

```sh
sprintai worktree init --no-seed
sprintai worktree init --seed-mode full
sprintai worktree init --from-instance default
sprintai worktree init --from-data-dir ~/.sprint
sprintai worktree init --force
```

**`pnpm sprintai worktree:make <name> [options]`** — Create `~/NAME` as a git worktree, then initialize an isolated Sprint instance inside it. This combines `git worktree add` with `worktree init` in a single step.

| Option | Description |
|---|---|
| `--start-point <ref>` | Remote ref to base the new branch on (e.g. `origin/main`) |
| `--instance <id>` | Explicit isolated instance id |
| `--home <path>` | Home root for worktree instances (default: `~/.sprint-worktrees`) |
| `--from-config <path>` | Source config.json to seed from |
| `--from-data-dir <path>` | Source SPRINT_HOME used when deriving the source config |
| `--from-instance <id>` | Source instance id (default: `default`) |
| `--server-port <port>` | Preferred server port |
| `--db-port <port>` | Preferred embedded Postgres port |
| `--seed-mode <mode>` | Seed profile: `minimal` or `full` (default: `minimal`) |
| `--no-seed` | Skip database seeding from the source instance |
| `--force` | Replace existing repo-local config and isolated instance data |

Examples:

```sh
pnpm sprintai worktree:make sprint-pr-432
pnpm sprintai worktree:make my-feature --start-point origin/main
pnpm sprintai worktree:make experiment --no-seed
```

**`pnpm sprintai worktree env [options]`** — Print shell exports for the current worktree-local Sprint instance.

| Option | Description |
|---|---|
| `-c, --config <path>` | Path to config file |
| `--json` | Print JSON instead of shell exports |

Examples:

```sh
pnpm sprintai worktree env
pnpm sprintai worktree env --json
eval "$(pnpm sprintai worktree env)"
```

For project execution worktrees, Sprint can also run a project-defined provision command after it creates or reuses an isolated git worktree. Configure this on the project's execution workspace policy (`workspaceStrategy.provisionCommand`). The command runs inside the derived worktree and receives `SPRINT_WORKSPACE_*`, `SPRINT_PROJECT_ID`, `SPRINT_AGENT_ID`, and `SPRINT_ISSUE_*` environment variables so each repo can bootstrap itself however it wants.

## Quick Health Checks

In another terminal:

```sh
curl http://localhost:3100/api/health
curl http://localhost:3100/api/companies
```

Expected:

- `/api/health` returns `{"status":"ok"}`
- `/api/companies` returns a JSON array

## Reset Local Dev Database

To wipe local dev data and start fresh:

```sh
rm -rf ~/.sprint/instances/default/db
pnpm dev
```

## Optional: Use External Postgres

If you set `DATABASE_URL`, the server will use that instead of embedded PostgreSQL.

## Automatic DB Backups

Sprint can run automatic DB backups on a timer. Defaults:

- enabled
- every 60 minutes
- retain 30 days
- backup dir: `~/.sprint/instances/default/data/backups`

Configure these in:

```sh
pnpm sprintai configure --section database
```

Run a one-off backup manually:

```sh
pnpm sprintai db:backup
# or:
pnpm db:backup
```

Environment overrides:

- `SPRINT_DB_BACKUP_ENABLED=true|false`
- `SPRINT_DB_BACKUP_INTERVAL_MINUTES=<minutes>`
- `SPRINT_DB_BACKUP_RETENTION_DAYS=<days>`
- `SPRINT_DB_BACKUP_DIR=/absolute/or/~/path`

## Secrets in Dev

Agent env vars now support secret references. By default, secret values are stored with local encryption and only secret refs are persisted in agent config.

- Default local key path: `~/.sprint/instances/default/secrets/master.key`
- Override key material directly: `SPRINT_SECRETS_MASTER_KEY`
- Override key file path: `SPRINT_SECRETS_MASTER_KEY_FILE`

Strict mode (recommended outside local trusted machines):

```sh
SPRINT_SECRETS_STRICT_MODE=true
```

When strict mode is enabled, sensitive env keys (for example `*_API_KEY`, `*_TOKEN`, `*_SECRET`) must use secret references instead of inline plain values.

CLI configuration support:

- `pnpm sprintai onboard` writes a default `secrets` config section (`local_encrypted`, strict mode off, key file path set) and creates a local key file when needed.
- `pnpm sprintai configure --section secrets` lets you update provider/strict mode/key path and creates the local key file when needed.
- `pnpm sprintai doctor` validates secrets adapter configuration and can create a missing local key file with `--repair`.

Migration helper for existing inline env secrets:

```sh
pnpm secrets:migrate-inline-env         # dry run
pnpm secrets:migrate-inline-env --apply # apply migration
```

## Company Deletion Toggle

Company deletion is intended as a dev/debug capability and can be disabled at runtime:

```sh
SPRINT_ENABLE_COMPANY_DELETION=false
```

Default behavior:

- `local_trusted`: enabled
- `authenticated`: disabled

## CLI Client Operations

Sprint CLI now includes client-side control-plane commands in addition to setup commands.

Quick examples:

```sh
pnpm sprintai issue list --company-id <company-id>
pnpm sprintai issue create --company-id <company-id> --title "Investigate checkout conflict"
pnpm sprintai issue update <issue-id> --status in_progress --comment "Started triage"
```

Set defaults once with context profiles:

```sh
pnpm sprintai context set --api-base http://localhost:3100 --company-id <company-id>
```

Then run commands without repeating flags:

```sh
pnpm sprintai issue list
pnpm sprintai dashboard get
```

See full command reference in `doc/CLI.md`.

## OpenClaw Invite Onboarding Endpoints

Agent-oriented invite onboarding now exposes machine-readable API docs:

- `GET /api/invites/:token` returns invite summary plus onboarding and skills index links.
- `GET /api/invites/:token/onboarding` returns onboarding manifest details (registration endpoint, claim endpoint template, skill install hints).
- `GET /api/invites/:token/onboarding.txt` returns a plain-text onboarding doc intended for both human operators and agents (llm.txt-style handoff), including optional inviter message and suggested network host candidates.
- `GET /api/skills/index` lists available skill documents.
- `GET /api/skills/sprint` returns the Sprint heartbeat skill markdown.

## OpenClaw Join Smoke Test

Run the end-to-end OpenClaw join smoke harness:

```sh
pnpm smoke:openclaw-join
```

What it validates:

- invite creation for agent-only join
- agent join request using `adapterType=openclaw`
- board approval + one-time API key claim semantics
- callback delivery on wakeup to a dockerized OpenClaw-style webhook receiver

Required permissions:

- This script performs board-governed actions (create invite, approve join, wakeup another agent).
- In authenticated mode, run with board auth via `SPRINT_AUTH_HEADER` or `SPRINT_COOKIE`.

Optional auth flags (for authenticated mode):

- `SPRINT_AUTH_HEADER` (for example `Bearer ...`)
- `SPRINT_COOKIE` (session cookie header value)

## OpenClaw Docker UI One-Command Script

To boot OpenClaw in Docker and print a host-browser dashboard URL in one command:

```sh
pnpm smoke:openclaw-docker-ui
```

This script lives at `scripts/smoke/openclaw-docker-ui.sh` and automates clone/build/config/start for Compose-based local OpenClaw UI testing.

Pairing behavior for this smoke script:

- default `OPENCLAW_DISABLE_DEVICE_AUTH=1` (no Control UI pairing prompt for local smoke; no extra pairing env vars required)
- set `OPENCLAW_DISABLE_DEVICE_AUTH=0` to require standard device pairing

Model behavior for this smoke script:

- defaults to OpenAI models (`openai/gpt-5.2` + OpenAI fallback) so it does not require Anthropic auth by default

State behavior for this smoke script:

- defaults to isolated config dir `~/.openclaw-sprint-smoke`
- resets smoke agent state each run by default (`OPENCLAW_RESET_STATE=1`) to avoid stale provider/auth drift

Networking behavior for this smoke script:

- auto-detects and prints a Sprint host URL reachable from inside OpenClaw Docker
- default container-side host alias is `host.docker.internal` (override with `SPRINT_HOST_FROM_CONTAINER` / `SPRINT_HOST_PORT`)
- if Sprint rejects container hostnames in authenticated/private mode, allow `host.docker.internal` via `pnpm sprintai allowed-hostname host.docker.internal` and restart Sprint
