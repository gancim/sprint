import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  listCodexSkills,
  syncCodexSkills,
} from "@sprintai/adapter-codex-local/server";

async function makeTempDir(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

describe("codex local skill sync", () => {
  const sprintKey = "sprintai/sprint/sprint";
  const cleanupDirs = new Set<string>();

  afterEach(async () => {
    await Promise.all(Array.from(cleanupDirs).map((dir) => fs.rm(dir, { recursive: true, force: true })));
    cleanupDirs.clear();
  });

  it("reports configured Sprint skills for workspace injection on the next run", async () => {
    const codexHome = await makeTempDir("sprint-codex-skill-sync-");
    cleanupDirs.add(codexHome);

    const ctx = {
      agentId: "agent-1",
      companyId: "company-1",
      adapterType: "codex_local",
      config: {
        env: {
          CODEX_HOME: codexHome,
        },
        sprintSkillSync: {
          desiredSkills: [sprintKey],
        },
      },
    } as const;

    const before = await listCodexSkills(ctx);
    expect(before.mode).toBe("ephemeral");
    expect(before.desiredSkills).toContain(sprintKey);
    expect(before.entries.find((entry) => entry.key === sprintKey)?.required).toBe(true);
    expect(before.entries.find((entry) => entry.key === sprintKey)?.state).toBe("configured");
    expect(before.entries.find((entry) => entry.key === sprintKey)?.detail).toContain(".agents/skills");
  });

  it("does not persist Sprint skills into CODEX_HOME during sync", async () => {
    const codexHome = await makeTempDir("sprint-codex-skill-prune-");
    cleanupDirs.add(codexHome);

    const configuredCtx = {
      agentId: "agent-2",
      companyId: "company-1",
      adapterType: "codex_local",
      config: {
        env: {
          CODEX_HOME: codexHome,
        },
        sprintSkillSync: {
          desiredSkills: [sprintKey],
        },
      },
    } as const;

    const after = await syncCodexSkills(configuredCtx, [sprintKey]);
    expect(after.mode).toBe("ephemeral");
    expect(after.entries.find((entry) => entry.key === sprintKey)?.state).toBe("configured");
    await expect(fs.lstat(path.join(codexHome, "skills", "sprint"))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("keeps required bundled Sprint skills configured even when the desired set is emptied", async () => {
    const codexHome = await makeTempDir("sprint-codex-skill-required-");
    cleanupDirs.add(codexHome);

    const configuredCtx = {
      agentId: "agent-2",
      companyId: "company-1",
      adapterType: "codex_local",
      config: {
        env: {
          CODEX_HOME: codexHome,
        },
        sprintSkillSync: {
          desiredSkills: [],
        },
      },
    } as const;

    const after = await syncCodexSkills(configuredCtx, []);
    expect(after.desiredSkills).toContain(sprintKey);
    expect(after.entries.find((entry) => entry.key === sprintKey)?.state).toBe("configured");
  });

  it("normalizes legacy flat Sprint skill refs before reporting configured state", async () => {
    const codexHome = await makeTempDir("sprint-codex-legacy-skill-sync-");
    cleanupDirs.add(codexHome);

    const snapshot = await listCodexSkills({
      agentId: "agent-3",
      companyId: "company-1",
      adapterType: "codex_local",
      config: {
        env: {
          CODEX_HOME: codexHome,
        },
        sprintSkillSync: {
          desiredSkills: ["sprint"],
        },
      },
    });

    expect(snapshot.warnings).toEqual([]);
    expect(snapshot.desiredSkills).toContain(sprintKey);
    expect(snapshot.desiredSkills).not.toContain("sprint");
    expect(snapshot.entries.find((entry) => entry.key === sprintKey)?.state).toBe("configured");
    expect(snapshot.entries.find((entry) => entry.key === "sprint")).toBeUndefined();
  });
});
