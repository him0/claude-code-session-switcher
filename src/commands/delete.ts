import { profileExists, removeProfile } from "../lib/profile";
import { error, success } from "../lib/ui";
import { createInterface } from "node:readline";

async function confirm(message: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${message} [y/N] `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

export async function del(name: string | undefined, force: boolean) {
  if (!name) error("Usage: ccp delete <name>");
  if (!(await profileExists(name))) {
    error(`Profile "${name}" not found.`);
  }

  if (!force) {
    const ok = await confirm(`Delete profile "${name}"?`);
    if (!ok) {
      console.log("Cancelled.");
      return;
    }
  }

  await removeProfile(name);
  success(`Profile "${name}" deleted.`);
}
