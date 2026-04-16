import { listProfiles } from "../lib/profile";
import { dim } from "../lib/ui";

export async function list() {
  const profiles = await listProfiles();

  if (profiles.length === 0) {
    console.log(dim("No profiles yet. Run `ccp create <name>` to create one."));
    return;
  }

  for (const name of profiles) {
    console.log(`  ${name}`);
  }
}
