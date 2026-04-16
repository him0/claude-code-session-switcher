import { listProfiles, RESERVED_PROFILE } from "../lib/profile";
import { dim } from "../lib/ui";

export async function list() {
  const profiles = await listProfiles();

  console.log(`  ${RESERVED_PROFILE} ${dim("(default)")}`);
  for (const name of profiles) {
    console.log(`  ${name}`);
  }
}
