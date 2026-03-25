import { describe, expect, it } from "vitest";
import { resolveJoinRequestAgentManagerId } from "../routes/access.js";

describe("resolveJoinRequestAgentManagerId", () => {
  it("returns null when no CEO exists in the company agent list", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "a1", role: "engineer", reportsTo: null },
      { id: "a2", role: "engineer", reportsTo: "a1" },
    ]);

    expect(managerId).toBeNull();
  });

  it("selects the root CEO when available", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "ceo-child", role: "scrum_master", reportsTo: "manager-1" },
      { id: "manager-1", role: "engineer", reportsTo: null },
      { id: "ceo-root", role: "scrum_master", reportsTo: null },
    ]);

    expect(managerId).toBe("ceo-root");
  });

  it("falls back to the first CEO when no root CEO is present", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "ceo-1", role: "scrum_master", reportsTo: "mgr" },
      { id: "ceo-2", role: "scrum_master", reportsTo: "mgr" },
      { id: "mgr", role: "engineer", reportsTo: null },
    ]);

    expect(managerId).toBe("ceo-1");
  });
});
