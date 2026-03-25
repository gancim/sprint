---
title: Setup Commands
summary: Onboard, run, doctor, and configure
---

Instance setup and diagnostics commands.

## `sprintai run`

One-command bootstrap and start:

```sh
pnpm sprintai run
```

Does:

1. Auto-onboards if config is missing
2. Runs `sprintai doctor` with repair enabled
3. Starts the server when checks pass

Choose a specific instance:

```sh
pnpm sprintai run --instance dev
```

## `sprintai onboard`

Interactive first-time setup:

```sh
pnpm sprintai onboard
```

First prompt:

1. `Quickstart` (recommended): local defaults (embedded database, no LLM provider, local disk storage, default secrets)
2. `Advanced setup`: full interactive configuration

Start immediately after onboarding:

```sh
pnpm sprintai onboard --run
```

Non-interactive defaults + immediate start (opens browser on server listen):

```sh
pnpm sprintai onboard --yes
```

## `sprintai doctor`

Health checks with optional auto-repair:

```sh
pnpm sprintai doctor
pnpm sprintai doctor --repair
```

Validates:

- Server configuration
- Database connectivity
- Secrets adapter configuration
- Storage configuration
- Missing key files

## `sprintai configure`

Update configuration sections:

```sh
pnpm sprintai configure --section server
pnpm sprintai configure --section secrets
pnpm sprintai configure --section storage
```

## `sprintai env`

Show resolved environment configuration:

```sh
pnpm sprintai env
```

## `sprintai allowed-hostname`

Allow a private hostname for authenticated/private mode:

```sh
pnpm sprintai allowed-hostname my-tailscale-host
```

## Local Storage Paths

| Data | Default Path |
|------|-------------|
| Config | `~/.sprint/instances/default/config.json` |
| Database | `~/.sprint/instances/default/db` |
| Logs | `~/.sprint/instances/default/logs` |
| Storage | `~/.sprint/instances/default/data/storage` |
| Secrets key | `~/.sprint/instances/default/secrets/master.key` |

Override with:

```sh
SPRINT_HOME=/custom/home SPRINT_INSTANCE_ID=dev pnpm sprintai run
```

Or pass `--data-dir` directly on any command:

```sh
pnpm sprintai run --data-dir ./tmp/sprint-dev
pnpm sprintai doctor --data-dir ./tmp/sprint-dev
```
