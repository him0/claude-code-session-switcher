# ccss - Claude Code Session Switcher

Switch [Claude Code](https://docs.anthropic.com/en/docs/claude-code) login sessions while sharing settings and history across them.

Each named session is a symlink to `~/.claude`, so settings and conversation history stay shared with your default profile — **only the login session is separated**. Sign in once per session and switch between accounts without losing your customizations.

## Install

```bash
bun install -g him0/claude-code-session-switcher
```

or

```bash
npm install -g him0/claude-code-session-switcher
```

## Run without installing

```bash
bunx him0/claude-code-session-switcher
```

or

```bash
npx him0/claude-code-session-switcher
```

## Usage

```
ccss                                  Show help
ccss create <name>                    Create a new session
ccss list                             List all sessions
ccss delete <name>                    Delete a session (--force to skip prompt)
ccss [-s <name>] exec <cmd> [args...] Run <cmd>; -s sets CLAUDE_CONFIG_DIR, omit for default
```

### Examples

```bash
# Create a session
ccss create work

# Launch Claude Code with that session
ccss -s work exec claude

# Pass additional arguments through to claude
ccss -s work exec claude --resume

# Run any command with the session's env (useful for debugging)
ccss -s work exec bash
ccss -s work exec env | grep CLAUDE

# List sessions
ccss list

# Delete a session
ccss delete work
```

Frequent users can alias their main flow:

```bash
alias cc-work='ccss -s work exec claude'
```

## How it works

Sessions are stored under `~/.config/ccsession/sessions/`. Each session is a symlink to `~/.claude` at creation time, so settings and conversation history are shared across all sessions. When running `ccss -s <name> exec <cmd>`, ccss sets `CLAUDE_CONFIG_DIR` to the session directory and spawns `<cmd>` — only the login session is separated.

## License

MIT
