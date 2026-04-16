import { homedir } from "node:os";
import { join } from "node:path";

export const HOME = homedir();
export const CLAUDE_DIR = join(HOME, ".claude");
export const CONFIG_DIR = join(HOME, ".config", "ccsession");
export const SESSIONS_DIR = join(CONFIG_DIR, "sessions");
