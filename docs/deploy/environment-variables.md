---
title: Environment Variables
summary: Full environment variable reference
---

All environment variables that Sprint uses for server configuration.

## Server Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3100` | Server port |
| `HOST` | `127.0.0.1` | Server host binding |
| `DATABASE_URL` | (embedded) | PostgreSQL connection string |
| `SPRINT_HOME` | `~/.sprint` | Base directory for all Sprint data |
| `SPRINT_INSTANCE_ID` | `default` | Instance identifier (for multiple local instances) |
| `SPRINT_DEPLOYMENT_MODE` | `local_trusted` | Runtime mode override |

## Secrets

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRINT_SECRETS_MASTER_KEY` | (from file) | 32-byte encryption key (base64/hex/raw) |
| `SPRINT_SECRETS_MASTER_KEY_FILE` | `~/.sprint/.../secrets/master.key` | Path to key file |
| `SPRINT_SECRETS_STRICT_MODE` | `false` | Require secret refs for sensitive env vars |

## Agent Runtime (Injected into agent processes)

These are set automatically by the server when invoking agents:

| Variable | Description |
|----------|-------------|
| `SPRINT_AGENT_ID` | Agent's unique ID |
| `SPRINT_COMPANY_ID` | Company ID |
| `SPRINT_API_URL` | Sprint API base URL |
| `SPRINT_API_KEY` | Short-lived JWT for API auth |
| `SPRINT_RUN_ID` | Current heartbeat run ID |
| `SPRINT_TASK_ID` | Issue that triggered this wake |
| `SPRINT_WAKE_REASON` | Wake trigger reason |
| `SPRINT_WAKE_COMMENT_ID` | Comment that triggered this wake |
| `SPRINT_APPROVAL_ID` | Resolved approval ID |
| `SPRINT_APPROVAL_STATUS` | Approval decision |
| `SPRINT_LINKED_ISSUE_IDS` | Comma-separated linked issue IDs |

## LLM Provider Keys (for adapters)

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (for Claude Local adapter) |
| `OPENAI_API_KEY` | OpenAI API key (for Codex Local adapter) |
