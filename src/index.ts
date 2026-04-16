#!/usr/bin/env bun

import pkg from "../package.json" with { type: "json" };
import { create } from "./commands/create";
import { list } from "./commands/list";
import { del } from "./commands/delete";
import { sessionDir, sessionExists, RESERVED_SESSION } from "./lib/session";
import { bold, dim, error } from "./lib/ui";


const HELP = `
${bold("ccss")} ${dim(`v${pkg.version}`)} - Claude Code Session Switcher

Switch Claude Code login sessions while sharing settings and history.

${bold("Usage:")}
  ccss <command> [args]
  ccss [-s <session>] exec <cmd> [args...]

${bold("Commands:")}
  create <name>                   Create a new session
  list                            List all sessions
  delete <name>                   Delete a session ${dim("(--force to skip prompt)")}
  [-s <name>] exec <cmd> [args]   Run <cmd>; ${dim("-s sets CLAUDE_CONFIG_DIR, omit for default")}

${bold("Options:")}
  -v, --version                   Print version
  -h, --help                      Show this help

${bold("Examples:")}
  ccss create work                     ${dim("# Create \"work\" session")}
  ccss -s work exec claude             ${dim("# Run claude as \"work\"")}
  ccss -s work exec claude --resume    ${dim("# Extra args pass through to claude")}
  ccss exec claude                     ${dim("# Run claude with default session")}
  ccss -s work exec bash               ${dim("# Run any command with the session env")}
`.trim();

type Parsed =
  | { kind: "help" }
  | { kind: "version" }
  | { kind: "create"; name: string | undefined }
  | { kind: "list" }
  | { kind: "delete"; name: string | undefined; force: boolean }
  | { kind: "exec"; session: string | null; cmd: string; cmdArgs: string[] }
  | { kind: "error"; message: string };

function parseArgs(argv: string[]): Parsed {
  const args = argv.slice(2);

  if (args.length === 0) return { kind: "help" };

  if (args[0] === "-v" || args[0] === "--version") return { kind: "version" };

  let session: string | null = null;
  let i = 0;
  while (i < args.length) {
    const a = args[i];
    if ((a === "-s" || a === "--session") && i + 1 < args.length) {
      session = args[i + 1];
      i += 2;
    } else {
      break;
    }
  }

  const rest = args.slice(i);
  if (rest.length === 0) {
    if (session !== null) {
      return { kind: "error", message: "Missing subcommand. Did you mean `ccss -s <name> exec <cmd>`?" };
    }
    return { kind: "help" };
  }

  const sub = rest[0];
  const subArgs = rest.slice(1);

  switch (sub) {
    case "help":
    case "--help":
    case "-h":
      return { kind: "help" };

    case "create":
      return { kind: "create", name: subArgs.find((a) => !a.startsWith("-")) };

    case "list":
    case "ls":
      return { kind: "list" };

    case "delete":
    case "rm": {
      const force = subArgs.includes("--force") || subArgs.includes("-f");
      const name = subArgs.find((a) => !a.startsWith("-"));
      return { kind: "delete", name, force };
    }

    case "exec": {
      if (subArgs.length === 0) {
        return { kind: "error", message: "Usage: ccss [-s <name>] exec <cmd> [args...]" };
      }
      return { kind: "exec", session, cmd: subArgs[0], cmdArgs: subArgs.slice(1) };
    }

    default:
      return { kind: "error", message: `Unknown command: "${sub}". Run \`ccss --help\`.` };
  }
}

function launchWithSession(session: string | null, cmd: string, cmdArgs: string[]) {
  const env = session
    ? { ...process.env, CLAUDE_CONFIG_DIR: sessionDir(session) }
    : process.env;

  const quote = (s: string) => `'${s.replace(/'/g, "'\\''")}'`;
  const escaped = [cmd, ...cmdArgs].map(quote).join(" ");
  const shell = process.env.SHELL || "zsh";
  const proc = Bun.spawn([shell, "-ic", escaped], {
    stdio: ["inherit", "inherit", "inherit"],
    env,
  });

  proc.exited.then((code) => process.exit(code));
}

async function main() {
  const parsed = parseArgs(process.argv);

  switch (parsed.kind) {
    case "help":
      console.log(HELP);
      return;

    case "version":
      console.log(pkg.version);
      return;

    case "error":
      error(parsed.message);

    case "create":
      return create(parsed.name);

    case "list":
      return list();

    case "delete":
      return del(parsed.name, parsed.force);

    case "exec": {
      const resolved = parsed.session === RESERVED_SESSION ? null : parsed.session;
      if (resolved && !(await sessionExists(resolved))) {
        error(`Session "${resolved}" not found. Run \`ccss create ${resolved}\` first.`);
      }
      return launchWithSession(resolved, parsed.cmd, parsed.cmdArgs);
    }
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
