# CLI Reference

Sprint CLI now supports both:

- instance setup/diagnostics (`onboard`, `doctor`, `configure`, `env`, `allowed-hostname`)
- control-plane client operations (issues, approvals, agents, activity, dashboard)

## Base Usage

Use repo script in development:

```sh
pnpm sprintai --help
```

First-time local bootstrap + run:

```sh
pnpm sprintai run
```

Choose local instance:

```sh
pnpm sprintai run --instance dev
```

## Deployment Modes

Mode taxonomy and design intent are documented in `doc/DEPLOYMENT-MODES.md`.

Current CLI behavior:

- `sprintai onboard` and `sprintai configure --section server` set deployment mode in config
- runtime can override mode with `SPRINT_DEPLOYMENT_MODE`
- `sprintai run` and `sprintai doctor` do not yet expose a direct `--mode` flag

Target behavior (planned) is documented in `doc/DEPLOYMENT-MODES.md` section 5.

Allow an authenticated/private hostname (for example custom Tailscale DNS):

```sh
pnpm sprintai allowed-hostname dotta-macbook-pro
```

All client commands support:

- `--data-dir <path>`
- `--api-base <url>`
- `--api-key <token>`
- `--context <path>`
- `--profile <name>`
- `--json`

Company-scoped commands also support `--company-id <id>`.

Use `--data-dir` on any CLI command to isolate all default local state (config/context/db/logs/storage/secrets) away from `~/.sprint`:

```sh
pnpm sprintai run --data-dir ./tmp/sprint-dev
pnpm sprintai issue list --data-dir ./tmp/sprint-dev
```

## Context Profiles

Store local defaults in `~/.sprint/context.json`:

```sh
pnpm sprintai context set --api-base http://localhost:3100 --company-id <company-id>
pnpm sprintai context show
pnpm sprintai context list
pnpm sprintai context use default
```

To avoid storing secrets in context, set `apiKeyEnvVarName` and keep the key in env:

```sh
pnpm sprintai context set --api-key-env-var-name SPRINT_API_KEY
export SPRINT_API_KEY=...
```

## Company Commands

```sh
pnpm sprintai company list
pnpm sprintai company get <company-id>
pnpm sprintai company delete <company-id-or-prefix> --yes --confirm <same-id-or-prefix>
```

Examples:

```sh
pnpm sprintai company delete PAP --yes --confirm PAP
pnpm sprintai company delete 5cbe79ee-acb3-4597-896e-7662742593cd --yes --confirm 5cbe79ee-acb3-4597-896e-7662742593cd
```

Notes:

- Deletion is server-gated by `SPRINT_ENABLE_COMPANY_DELETION`.
- With agent authentication, company deletion is company-scoped. Use the current company ID/prefix (for example via `--company-id` or `SPRINT_COMPANY_ID`), not another company.

## Issue Commands

```sh
pnpm sprintai issue list --company-id <company-id> [--status todo,in_progress] [--assignee-agent-id <agent-id>] [--match text]
pnpm sprintai issue get <issue-id-or-identifier>
pnpm sprintai issue create --company-id <company-id> --title "..." [--description "..."] [--status todo] [--priority high]
pnpm sprintai issue update <issue-id> [--status in_progress] [--comment "..."]
pnpm sprintai issue comment <issue-id> --body "..." [--reopen]
pnpm sprintai issue checkout <issue-id> --agent-id <agent-id> [--expected-statuses todo,backlog,blocked]
pnpm sprintai issue release <issue-id>
```

## Agent Commands

```sh
pnpm sprintai agent list --company-id <company-id>
pnpm sprintai agent get <agent-id>
pnpm sprintai agent local-cli <agent-id-or-shortname> --company-id <company-id>
```

`agent local-cli` is the quickest way to run local Claude/Codex manually as a Sprint agent:

- creates a new long-lived agent API key
- installs missing Sprint skills into `~/.codex/skills` and `~/.claude/skills`
- prints `export ...` lines for `SPRINT_API_URL`, `SPRINT_COMPANY_ID`, `SPRINT_AGENT_ID`, and `SPRINT_API_KEY`

Example for shortname-based local setup:

```sh
pnpm sprintai agent local-cli codexcoder --company-id <company-id>
pnpm sprintai agent local-cli claudecoder --company-id <company-id>
```

## Approval Commands

```sh
pnpm sprintai approval list --company-id <company-id> [--status pending]
pnpm sprintai approval get <approval-id>
pnpm sprintai approval create --company-id <company-id> --type hire_agent --payload '{"name":"..."}' [--issue-ids <id1,id2>]
pnpm sprintai approval approve <approval-id> [--decision-note "..."]
pnpm sprintai approval reject <approval-id> [--decision-note "..."]
pnpm sprintai approval request-revision <approval-id> [--decision-note "..."]
pnpm sprintai approval resubmit <approval-id> [--payload '{"...":"..."}']
pnpm sprintai approval comment <approval-id> --body "..."
```

## Activity Commands

```sh
pnpm sprintai activity list --company-id <company-id> [--agent-id <agent-id>] [--entity-type issue] [--entity-id <id>]
```

## Dashboard Commands

```sh
pnpm sprintai dashboard get --company-id <company-id>
```

## Heartbeat Command

`heartbeat run` now also supports context/api-key options and uses the shared client stack:

```sh
pnpm sprintai heartbeat run --agent-id <agent-id> [--api-base http://localhost:3100] [--api-key <token>]
```

## Local Storage Defaults

Default local instance root is `~/.sprint/instances/default`:

- config: `~/.sprint/instances/default/config.json`
- embedded db: `~/.sprint/instances/default/db`
- logs: `~/.sprint/instances/default/logs`
- storage: `~/.sprint/instances/default/data/storage`
- secrets key: `~/.sprint/instances/default/secrets/master.key`

Override base home or instance with env vars:

```sh
SPRINT_HOME=/custom/home SPRINT_INSTANCE_ID=dev pnpm sprintai run
```

## Storage Configuration

Configure storage provider and settings:

```sh
pnpm sprintai configure --section storage
```

Supported providers:

- `local_disk` (default; local single-user installs)
- `s3` (S3-compatible object storage)
