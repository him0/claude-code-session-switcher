import { sessionExists, removeSession } from "../lib/session";
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
  if (!name) error("Usage: ccss delete <name>");
  if (!(await sessionExists(name))) {
    error(`Session "${name}" not found.`);
  }

  if (!force) {
    const ok = await confirm(`Delete session "${name}"?`);
    if (!ok) {
      console.log("Cancelled.");
      return;
    }
  }

  await removeSession(name);
  success(`Session "${name}" deleted.`);
}
