import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  describeLocalInstancePaths,
  expandHomePrefix,
  resolveSprintHomeDir,
  resolveSprintInstanceId,
} from "../config/home.js";

const ORIGINAL_ENV = { ...process.env };

describe("home path resolution", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("defaults to ~/.sprint and default instance", () => {
    delete process.env.SPRINT_HOME;
    delete process.env.SPRINT_INSTANCE_ID;

    const paths = describeLocalInstancePaths();
    expect(paths.homeDir).toBe(path.resolve(os.homedir(), ".sprint"));
    expect(paths.instanceId).toBe("default");
    expect(paths.configPath).toBe(path.resolve(os.homedir(), ".sprint", "instances", "default", "config.json"));
  });

  it("supports SPRINT_HOME and explicit instance ids", () => {
    process.env.SPRINT_HOME = "~/sprint-home";

    const home = resolveSprintHomeDir();
    expect(home).toBe(path.resolve(os.homedir(), "sprint-home"));
    expect(resolveSprintInstanceId("dev_1")).toBe("dev_1");
  });

  it("rejects invalid instance ids", () => {
    expect(() => resolveSprintInstanceId("bad/id")).toThrow(/Invalid instance id/);
  });

  it("expands ~ prefixes", () => {
    expect(expandHomePrefix("~")).toBe(os.homedir());
    expect(expandHomePrefix("~/x/y")).toBe(path.resolve(os.homedir(), "x/y"));
  });
});
