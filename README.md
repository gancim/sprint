<p align="center">
  <img src="docs/images/logo-light.svg#gh-light-mode-only" alt="Sprint" width="200" />
  <img src="docs/images/logo-dark.svg#gh-dark-mode-only" alt="Sprint" width="200" />
</p>

<p align="center">
  <a href="#quickstart"><strong>Quickstart</strong></a> &middot;
  <a href="#features"><strong>Features</strong></a> &middot;
  <a href="https://github.com/sprintai/sprint"><strong>GitHub</strong></a> &middot;
  <a href="https://discord.gg/m4HZY7xNG3"><strong>Discord</strong></a>
</p>

<p align="center">
  <a href="https://github.com/sprintai/sprint/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a>
  <a href="https://github.com/sprintai/sprint/stargazers"><img src="https://img.shields.io/github/stars/sprintai/sprint?style=flat" alt="Stars" /></a>
  <a href="https://discord.gg/m4HZY7xNG3"><img src="https://img.shields.io/discord/000000000?label=discord" alt="Discord" /></a>
</p>

<br/>

## Open-source orchestration for AI-powered scrum teams

**Sprint runs a full scrum team of AI agents — Scrum Master, Engineers, Designers, QA, and Product Manager — working together on your product.**

Sprint is a Node.js server and React UI that orchestrates a team of AI agents through agile sprints. Define your backlog, assign roles, and watch your team plan, build, test, and ship — tracked from one dashboard.

It looks like a task manager — but under the hood it runs sprint ceremonies, manages team coordination, enforces role boundaries, and keeps every agent accountable.

**Manage the sprint, not the agents.**

|        | Step                  | Example                                                                 |
| ------ | --------------------- | ----------------------------------------------------------------------- |
| **01** | Define the backlog    | _"Build user authentication with OAuth and session management."_        |
| **02** | Assemble the team     | Scrum Master, Engineers, Designers, QA, PM — any bot, any provider.    |
| **03** | Run the sprint        | Scrum Master plans, team executes, QA validates, PM signs off.          |

<br/>

## The Scrum Team

| Role | Responsibility |
| ---- | -------------- |
| **Scrum Master** | Facilitates sprints, runs ceremonies, removes blockers, coordinates the team. |
| **Product Manager / Product Owner** | Owns the backlog, defines priorities and acceptance criteria. |
| **Engineers** | Implement features, fixes, and technical tasks. |
| **Designers** | Produce UX designs, prototypes, and design reviews. |
| **QA** | Test completed work and validate acceptance criteria. |

<br/>

## Features

<table>
<tr>
<td align="center" width="33%">
<h3>🔌 Bring Your Own Agent</h3>
Any agent, any runtime, one scrum team. If it can receive a heartbeat, it's on the team.
</td>
<td align="center" width="33%">
<h3>🎯 Sprint Planning</h3>
Every task traces back to the sprint goal. Agents know <em>what</em> to build and <em>why</em>.
</td>
<td align="center" width="33%">
<h3>💓 Heartbeats</h3>
Agents wake on a schedule, check their tickets, and act. The Scrum Master coordinates flow.
</td>
</tr>
<tr>
<td align="center">
<h3>⚡ Skill Injection</h3>
Agents learn Sprint workflows and project context at runtime — no retraining, no prompt engineering.
</td>
<td align="center">
<h3>👥 Multi-Team</h3>
One deployment, many scrum teams. Complete data isolation. One control plane for all your projects.
</td>
<td align="center">
<h3>🎫 Ticket System</h3>
Every conversation traced. Every decision explained. Full tool-call tracing and immutable audit log.
</td>
</tr>
<tr>
<td align="center">
<h3>🛡️ Governance</h3>
You're the product owner. Approve scope, override priorities, pause or reassign any agent — at any time.
</td>
<td align="center">
<h3>📊 Team Chart</h3>
Roles, reporting lines, and skill sets. Your agents have a title, a role, and a job description.
</td>
<td align="center">
<h3>📱 Mobile Ready</h3>
Monitor and manage your sprints from anywhere.
</td>
</tr>
</table>

<br/>

## Problems Sprint solves

| Without Sprint | With Sprint |
| -------------- | ----------- |
| ❌ You have 20 Claude Code tabs open — engineers, QA, designers all running independently with no coordination. | ✅ All agents work from the same sprint board. The Scrum Master assigns tickets and tracks progress. |
| ❌ QA doesn't know when engineering is done. Engineering doesn't know what design finalized. | ✅ Agents @-mention each other, assign tickets, and coordinate through comments — just like a real team. |
| ❌ You manually remind each agent what sprint goal they're working toward. | ✅ Context flows from the sprint goal through every ticket. Agents always know the why. |
| ❌ Runaway agent loops duplicate work — two agents pick up the same ticket. | ✅ Ticket checkout is atomic. Once an agent claims a task, no other agent can claim it. |
| ❌ Recurring ceremonies (standups, sprint reviews) have to be kicked off manually. | ✅ Heartbeats handle scheduled ceremonies. The Scrum Master runs them automatically. |
| ❌ You have a feature idea and have to manually coordinate who builds, designs, and tests it. | ✅ Add a ticket to the backlog. Sprint's Scrum Master breaks it down and assigns it to the right role. |

<br/>

## Why Sprint is special

Sprint handles the hard orchestration details correctly.

| | |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Atomic execution.** | Ticket checkout is atomic — no double-work, no duplicate execution across agents. |
| **Persistent agent state.** | Agents resume the same task context across heartbeats instead of restarting from scratch. |
| **Runtime skill injection.** | Agents learn Sprint workflows and project context at runtime, without retraining. |
| **Governance with rollback.** | Approval gates are enforced, config changes are versioned, and bad changes can be rolled back safely. |
| **Goal-aware execution.** | Tasks carry full sprint goal context so agents see the "why," not just a ticket title. |
| **Portable team templates.** | Export/import teams, agents, and skills with secret scrubbing and collision handling. |
| **True multi-team isolation.** | Every entity is team-scoped, so one deployment can run many scrum teams with separate data and audit trails. |

<br/>

## Sprint is right for you if

- ✅ You want to run an **AI-powered scrum team** that actually coordinates
- ✅ You coordinate **engineers, designers, QA, and a PM** toward a shared sprint goal
- ✅ You have **multiple Claude Code agents** open and need a Scrum Master to keep them aligned
- ✅ You want agents running **autonomously** but still want to review work and chime in
- ✅ You want a process that **feels like real agile** — standups, sprint planning, retros

<br/>

## What Sprint is not

| | |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Not a chatbot.** | Agents have roles and tickets, not chat windows. |
| **Not an agent framework.** | We don't tell you how to build agents. We tell you how to run a scrum team made of them. |
| **Not a workflow builder.** | No drag-and-drop pipelines. Sprint models scrum teams — with roles, sprint boards, goals, and governance. |
| **Not a prompt manager.** | Agents bring their own prompts, models, and runtimes. Sprint manages the team they work in. |
| **Not a single-agent tool.** | This is for teams. If you have one agent, you probably don't need Sprint. If you have five roles to fill — you do. |
| **Not a code review tool.** | Sprint orchestrates work, not pull requests. Bring your own review process. |

<br/>

## Quickstart

Open source. Self-hosted. No Sprint account required.

```bash
git clone https://github.com/gancim/sprint.git
cd sprint
pnpm install
pnpm dev
```

This starts the API server at `http://localhost:3100`. An embedded PostgreSQL database is created automatically — no setup required.

> **Requirements:** Node.js 20+, pnpm 9.15+

<br/>

## FAQ

**What does a typical setup look like?**
Locally, a single Node.js process manages an embedded Postgres and local file storage. Configure your scrum team — a Scrum Master, engineers, designers, QA, and a PM — then add sprint goals and tickets. The agents take care of the rest.

**Can I run multiple teams?**
Yes. A single deployment can run an unlimited number of scrum teams with complete data isolation.

**How is Sprint different from agents like OpenClaw or Claude Code?**
Sprint _uses_ those agents. It orchestrates them into a scrum team — with sprint boards, role assignments, ceremonies, and accountability.

**Do agents run continuously?**
By default, agents run on scheduled heartbeats and event-based triggers (ticket assignment, @-mentions). The Scrum Master wakes up to run ceremonies and coordinate the team. You bring your agents and Sprint coordinates.

<br/>

## Development

```bash
pnpm dev              # Full dev (API + UI, watch mode)
pnpm dev:once         # Full dev without file watching
pnpm dev:server       # Server only
pnpm build            # Build all
pnpm typecheck        # Type checking
pnpm test:run         # Run tests
pnpm db:generate      # Generate DB migration
pnpm db:migrate       # Apply migrations
```

See [doc/DEVELOPING.md](doc/DEVELOPING.md) for the full development guide.

<br/>

## License

MIT &copy; 2026 Sprint AI

---

<p align="center">
  <sub>Open source under MIT. Built for teams who want to ship, not babysit agents.</sub>
</p>
