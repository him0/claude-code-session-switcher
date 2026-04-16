# ccp - Claude Code Profile switcher

Switch between multiple [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI profiles.

Each profile gets its own config directory (`CLAUDE_CONFIG_DIR`), so you can maintain separate settings, credentials, and conversation history per context (e.g. work vs personal).

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
ccp -p <profile>          Launch Claude Code with a named profile
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
ccp -p work

# Pass additional arguments to Claude Code
ccp -p work --resume

# List profiles
ccp list

# Delete a profile
ccp delete work
```

## How it works

Profiles are stored under `~/.config/ccprofile/profiles/`. Each profile is a symlink to `~/.claude` at creation time. When launching with `-p <profile>`, ccp sets `CLAUDE_CONFIG_DIR` to the profile directory and spawns `claude`.

## License

MIT
