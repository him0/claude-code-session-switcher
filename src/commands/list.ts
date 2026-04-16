import { listSessions, RESERVED_SESSION } from "../lib/session";
import { dim } from "../lib/ui";

export async function list() {
  const sessions = await listSessions();

  console.log(`  ${RESERVED_SESSION} ${dim("(default)")}`);
  for (const name of sessions) {
    console.log(`  ${name}`);
  }
}
