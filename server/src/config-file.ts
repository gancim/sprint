import fs from "node:fs";
import { sprintConfigSchema, type SprintConfig } from "@sprintai/shared";
import { resolveSprintConfigPath } from "./paths.js";

export function readConfigFile(): SprintConfig | null {
  const configPath = resolveSprintConfigPath();

  if (!fs.existsSync(configPath)) return null;

  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return sprintConfigSchema.parse(raw);
  } catch {
    return null;
  }
}
