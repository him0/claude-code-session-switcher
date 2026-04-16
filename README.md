# ccss - Claude Code Session Switcher

Switch [Claude Code](https://docs.anthropic.com/en/docs/claude-code) login sessions while sharing settings and history across them.

Each named session is a symlink to `~/.claude`, so settings and conversation history stay shared with your default profile — **only the login session is separated**. Sign in once per session and switch between accounts without losing your customizations.

## Install

```bash
bunx him0/ccprofile
```

or

```bash
npx him0/ccprofile
```

## Usage

```
ccss                                  Show help
ccss create <name>                    Create a new session
ccss list                             List all sessions
ccss delete <name>                    Delete a session (--force to skip prompt)
ccss -p <name> exec <cmd> [args...]   Run <cmd> with the session's CLAUDE_CONFIG_DIR
```

### Examples

```bash
# Create a session
ccss create work

# Launch Claude Code with that session
ccss -p work exec claude

# Pass additional arguments through to claude
ccss -p work exec claude --resume

# Run any command with the session's env (useful for debugging)
ccss -p work exec bash
ccss -p work exec env | grep CLAUDE

# List sessions
ccss list

# Delete a session
ccss delete work
```

Frequent users can alias their main flow:

```bash
alias cc-work='ccss -p work exec claude'
```

## How it works

Sessions are stored under `~/.config/ccsession/sessions/`. Each session is a symlink to `~/.claude` at creation time, so settings and conversation history are shared across all sessions. When running `ccss -p <name> exec <cmd>`, ccss sets `CLAUDE_CONFIG_DIR` to the session directory and spawns `<cmd>` — only the login session is separated.

## License

MIT
