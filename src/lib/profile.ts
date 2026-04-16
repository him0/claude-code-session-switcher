import { readdir, symlink, mkdir, rm, lstat } from "node:fs/promises";
import { join } from "node:path";
import { CLAUDE_DIR, PROFILES_DIR } from "./paths";

const NAME_RE = /^[a-zA-Z0-9_-]+$/;
export const RESERVED_PROFILE = "default";

export function validateName(name: string): void {
  if (!NAME_RE.test(name)) {
    throw new Error(`Invalid profile name "${name}". Use only alphanumeric, hyphen, underscore.`);
  }
  if (name === RESERVED_PROFILE) {
    throw new Error(`"${RESERVED_PROFILE}" is a reserved profile name.`);
  }
}

export function profileDir(name: string): string {
  return join(PROFILES_DIR, name);
}

export async function ensureProfilesDir(): Promise<void> {
  await mkdir(PROFILES_DIR, { recursive: true });
}

export async function profileExists(name: string): Promise<boolean> {
  try {
    const stat = await lstat(profileDir(name));
    return stat.isSymbolicLink() || stat.isDirectory();
  } catch {
    return false;
  }
}

export async function listProfiles(): Promise<string[]> {
  try {
    const entries = await readdir(PROFILES_DIR);
    return entries.filter((e) => !e.startsWith("."));
  } catch {
    return [];
  }
}

export async function createProfileSymlink(name: string): Promise<void> {
  const dir = profileDir(name);
  try {
    await lstat(dir);
    throw new Error(`Profile "${name}" already exists.`);
  } catch (e: any) {
    if (e.code !== "ENOENT") throw e;
  }
  await symlink(CLAUDE_DIR, dir);
}

export async function removeProfile(name: string): Promise<void> {
  const dir = profileDir(name);
  const stat = await lstat(dir);
  if (stat.isSymbolicLink()) {
    await rm(dir);
  } else {
    await rm(dir, { recursive: true });
  }
}
