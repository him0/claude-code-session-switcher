import { validateName, ensureSessionsDir, createSessionSymlink } from "../lib/session";
import { error, success } from "../lib/ui";

export async function create(name: string | undefined) {
  if (!name) error("Usage: ccss create <name>");
  validateName(name);
  await ensureSessionsDir();
  try {
    await createSessionSymlink(name);
  } catch (e: any) {
    error(e.message);
  }
  success(`Session "${name}" created.`);
}
