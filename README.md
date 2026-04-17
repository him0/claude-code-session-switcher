# ccss - Claude Code Session Switcher

Switch [Claude Code](https://docs.anthropic.com/en/docs/claude-code) login sessions while sharing settings and history across them.

Each named session is a symlink to `~/.claude`, so settings and conversation history stay shared with your default profile — **only the login session is separated**. Sign in once per session and switch between accounts without losing your customizations.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/him0/claude-code-session-switcher/main/install.sh | sh
```

The installer downloads the prebuilt binary for your platform from the latest GitHub Release and installs it to `~/.local/bin/ccss`. Override the destination with `CCSS_INSTALL_DIR`, or pin a version with `CCSS_VERSION=vX.Y.Z`.

Supported targets: `linux-x64`, `linux-arm64`, `darwin-arm64` (Apple Silicon).

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

## Environment variables

When `ccss exec` launches a command, these variables are set in the child process:

- `CCSS` — always `1`, a marker that the command is running under ccss
- `CLAUDE_CONFIG_DIR` — path to the session directory (only set when `-s <name>` is given)
- `CCSS_SESSION_NAME` — the session name (`default` when `-s` is omitted)

`CCSS` and `CCSS_SESSION_NAME` are handy for showing the current session in your shell prompt or status line.

## License

MIT
