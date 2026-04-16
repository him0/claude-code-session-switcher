#!/usr/bin/env bun

import { create } from "./commands/create";
import { list } from "./commands/list";
import { del } from "./commands/delete";
import { profileDir, profileExists } from "./lib/profile";
import { bold, dim, error } from "./lib/ui";


const HELP = `
${bold("ccp")} - Claude Code Profile switcher

${bold("Usage:")}
  ccp                       Launch claude (default ~/.claude)
  ccp -p <profile>          Launch claude with a profile
  ccp <command> [args]

${bold("Commands:")}
  create <name>     Create a new profile
  list              List all profiles
  delete <name>     Delete a profile ${dim("(--force to skip prompt)")}

${bold("Examples:")}
  ccp create work       Create "work" profile
  ccp -p work           Launch claude as "work"
  ccp -p work -p work   All args after profile are passed to claude
`.trim();

const SUBCOMMANDS = new Set(["create", "list", "ls", "delete", "rm", "help", "--help", "-h"]);

function parseArgs(argv: string[]): { profile: string | null; claudeArgs: string[] } | { subcommand: string; subArgs: string[] } {
  const args = argv.slice(2);

  if (args.length === 0) {
    return { profile: null, claudeArgs: [] };
  }

  if (SUBCOMMANDS.has(args[0])) {
    return { subcommand: args[0], subArgs: args.slice(1) };
  }

  let profile: string | null = null;
  const claudeArgs: string[] = [];
  let i = 0;

  while (i < args.length) {
    if ((args[i] === "-p" || args[i] === "--profile") && i + 1 < args.length) {
      profile = args[i + 1];
      i += 2;
    } else {
      claudeArgs.push(args[i]);
      i++;
    }
  }

  return { profile, claudeArgs };
}

function launchClaude(profile: string | null, claudeArgs: string[]) {
  const env = profile
    ? { ...process.env, CLAUDE_CONFIG_DIR: profileDir(profile) }
    : process.env;

  const escaped = claudeArgs.map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(" ");
  const cmd = escaped ? `claude ${escaped}` : "claude";
  const shell = process.env.SHELL || "zsh";
  const proc = Bun.spawn([shell, "-ic", cmd], {
    stdio: ["inherit", "inherit", "inherit"],
    env,
  });

  proc.exited.then((code) => process.exit(code));
}

async function main() {
  const parsed = parseArgs(process.argv);

  if ("subcommand" in parsed) {
    const { subcommand, subArgs } = parsed;
    const hasForce = subArgs.includes("--force") || subArgs.includes("-f");
    const arg1 = subArgs.find((a) => !a.startsWith("-"));

    switch (subcommand) {
      case "create":
        return create(arg1);
      case "list":
      case "ls":
        return list();
      case "delete":
      case "rm":
        return del(arg1, hasForce);
      case "help":
      case "--help":
      case "-h":
        console.log(HELP);
        return;
    }
  }

  const { profile, claudeArgs } = parsed;

  if (profile && !(await profileExists(profile))) {
    error(`Profile "${profile}" not found. Run \`ccp create ${profile}\` first.`);
  }

  launchClaude(profile, claudeArgs);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
