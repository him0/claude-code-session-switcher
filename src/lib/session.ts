import { readdir, symlink, mkdir, rm, lstat } from "node:fs/promises";
import { join } from "node:path";
import { CLAUDE_DIR, SESSIONS_DIR } from "./paths";

const NAME_RE = /^[a-zA-Z0-9_-]+$/;
export const RESERVED_SESSION = "default";

export function validateName(name: string): void {
  if (!NAME_RE.test(name)) {
    throw new Error(`Invalid session name "${name}". Use only alphanumeric, hyphen, underscore.`);
  }
  if (name === RESERVED_SESSION) {
    throw new Error(`"${RESERVED_SESSION}" is a reserved session name.`);
  }
}

export function sessionDir(name: string): string {
  return join(SESSIONS_DIR, name);
}

export async function ensureSessionsDir(): Promise<void> {
  await mkdir(SESSIONS_DIR, { recursive: true });
}

export async function sessionExists(name: string): Promise<boolean> {
  try {
    const stat = await lstat(sessionDir(name));
    return stat.isSymbolicLink() || stat.isDirectory();
  } catch {
    return false;
  }
}

export async function listSessions(): Promise<string[]> {
  try {
    const entries = await readdir(SESSIONS_DIR);
    return entries.filter((e) => !e.startsWith("."));
  } catch {
    return [];
  }
}

export async function createSessionSymlink(name: string): Promise<void> {
  const dir = sessionDir(name);
  try {
    await lstat(dir);
    throw new Error(`Session "${name}" already exists.`);
  } catch (e: any) {
    if (e.code !== "ENOENT") throw e;
  }
  await symlink(CLAUDE_DIR, dir);
}

export async function removeSession(name: string): Promise<void> {
  const dir = sessionDir(name);
  const stat = await lstat(dir);
  if (stat.isSymbolicLink()) {
    await rm(dir);
  } else {
    await rm(dir, { recursive: true });
  }
}
