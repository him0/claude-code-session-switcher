# ccp - Claude Code Profile switcher

Switch between multiple [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI profiles.

Each profile maintains its own login session while sharing settings and conversation history with your default `~/.claude`. Switch between different accounts without losing your customizations.

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
ccp                       Launch Claude Code (default ~/.claude)
ccp -P <profile>          Launch Claude Code with a named profile
ccp <command> [args]
```

### Commands

| Command | Description |
|---|---|
| `ccp create <name>` | Create a new profile |
| `ccp list` | List all profiles |
| `ccp delete <name>` | Delete a profile (`--force` to skip confirmation) |

### Examples

```bash
# Create a profile
ccp create work

# Launch Claude Code with that profile
ccp -P work

# Pass additional arguments to Claude Code
ccp -P work --resume

# List profiles
ccp list

# Delete a profile
ccp delete work
```

## How it works

Profiles are stored under `~/.config/ccprofile/profiles/`. Each profile is a symlink to `~/.claude` at creation time, so settings and conversation history are shared across all profiles. When launching with `-P <profile>`, ccp sets `CLAUDE_CONFIG_DIR` to the profile directory and spawns `claude` — only the login session is separated.

## License

MIT
