---
name: sprint-create-agent
description: >
  Add a new team member to the scrum team in Sprint. Use when you need to
  inspect adapter configuration options, compare existing agent configs,
  draft a new agent prompt/config, and submit an onboarding request.
---

# Sprint Create Agent Skill

Use this skill when you are asked to add a new team member to the scrum team.

## Scrum Team Roles

When adding a team member, choose the appropriate role:
- `scrum_master` — facilitates sprints, removes blockers, runs ceremonies
- `product_owner` — owns the backlog, defines priorities and acceptance criteria
- `engineer` — implements features, fixes, and technical tasks
- `designer` — produces UX designs, prototypes, and design reviews
- `qa` — tests completed work and validates acceptance criteria
- `pm` — product manager, collaborates with product owner on requirements
- `devops` — infrastructure, CI/CD, deployment pipelines

## Preconditions

You need either:

- board access, or
- agent permission `can_create_agents=true` in your team

If you do not have this permission, escalate to the Scrum Master or board.

## Workflow

1. Confirm identity and company context.

```sh
curl -sS "$SPRINT_API_URL/api/agents/me" \
  -H "Authorization: Bearer $SPRINT_API_KEY"
```

2. Discover available adapter configuration docs for this Sprint instance.

```sh
curl -sS "$SPRINT_API_URL/llms/agent-configuration.txt" \
  -H "Authorization: Bearer $SPRINT_API_KEY"
```

3. Read adapter-specific docs (example: `claude_local`).

```sh
curl -sS "$SPRINT_API_URL/llms/agent-configuration/claude_local.txt" \
  -H "Authorization: Bearer $SPRINT_API_KEY"
```

4. Compare existing agent configurations in your company.

```sh
curl -sS "$SPRINT_API_URL/api/companies/$SPRINT_COMPANY_ID/agent-configurations" \
  -H "Authorization: Bearer $SPRINT_API_KEY"
```

5. Discover allowed agent icons and pick one that matches the role.

```sh
curl -sS "$SPRINT_API_URL/llms/agent-icons.txt" \
  -H "Authorization: Bearer $SPRINT_API_KEY"
```

6. Draft the new team member config:
- role/title/name (choose role from the scrum team roles listed above)
- icon (required in practice; use one from `/llms/agent-icons.txt`)
- reporting line (`reportsTo`) — typically the Scrum Master or Product Owner
- adapter type
- optional `desiredSkills` from the team skill library when this role needs installed skills on day one
- adapter and runtime config aligned to this environment
- capabilities description (what this team member does in the sprint)
- run prompt in adapter config (`promptTemplate` where applicable)
- source issue linkage (`sourceIssueId` or `sourceIssueIds`) when this onboarding came from an issue

7. Submit onboarding request.

```sh
curl -sS -X POST "$SPRINT_API_URL/api/companies/$SPRINT_COMPANY_ID/agent-hires" \
  -H "Authorization: Bearer $SPRINT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backend Engineer",
    "role": "engineer",
    "title": "Backend Engineer",
    "icon": "code",
    "reportsTo": "<scrum-master-agent-id>",
    "capabilities": "Implements backend features, APIs, and bug fixes assigned in each sprint",
    "desiredSkills": [],
    "adapterType": "claude_local",
    "adapterConfig": {"cwd": "/abs/path/to/repo", "model": "claude-sonnet-4-6"},
    "runtimeConfig": {"heartbeat": {"enabled": true, "intervalSec": 300, "wakeOnDemand": true}},
    "sourceIssueId": "<issue-id>"
  }'
```

8. Handle governance state:
- if response has `approval`, onboarding is `pending_approval`
- monitor and discuss on approval thread
- when the board approves, you will be woken with `SPRINT_APPROVAL_ID`; read linked issues and close/comment follow-up

```sh
curl -sS "$SPRINT_API_URL/api/approvals/<approval-id>" \
  -H "Authorization: Bearer $SPRINT_API_KEY"

curl -sS -X POST "$SPRINT_API_URL/api/approvals/<approval-id>/comments" \
  -H "Authorization: Bearer $SPRINT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"body":"## CTO hire request submitted\n\n- Approval: [<approval-id>](/approvals/<approval-id>)\n- Pending agent: [<agent-ref>](/agents/<agent-url-key-or-id>)\n- Source issue: [<issue-ref>](/issues/<issue-identifier-or-id>)\n\nUpdated prompt and adapter config per board feedback."}'
```

If the approval already exists and needs manual linking to the issue:

```sh
curl -sS -X POST "$SPRINT_API_URL/api/issues/<issue-id>/approvals" \
  -H "Authorization: Bearer $SPRINT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"approvalId":"<approval-id>"}'
```

After approval is granted, run this follow-up loop:

```sh
curl -sS "$SPRINT_API_URL/api/approvals/$SPRINT_APPROVAL_ID" \
  -H "Authorization: Bearer $SPRINT_API_KEY"

curl -sS "$SPRINT_API_URL/api/approvals/$SPRINT_APPROVAL_ID/issues" \
  -H "Authorization: Bearer $SPRINT_API_KEY"
```

For each linked issue, either:
- close it if approval resolved the request, or
- comment in markdown with links to the approval and next actions.

## Quality Bar

Before submitting an onboarding request:

- if the role needs skills, make sure they already exist in the team library or install them first using the Sprint team-skills workflow
- Reuse proven config patterns from agents with the same role where possible.
- Set a concrete `icon` from `/llms/agent-icons.txt` so the new team member is identifiable in the sprint board.
- Avoid secrets in plain text unless required by adapter behavior.
- Ensure reporting line is correct and within the team.
- Ensure prompt is role-specific and scoped to sprint work (not generic).
- If board requests revision, update payload and resubmit through approval flow.

For endpoint payload shapes and full examples, read:
`skills/sprint-create-agent/references/api-reference.md`
