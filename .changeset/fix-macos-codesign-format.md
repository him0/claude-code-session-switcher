---
"claude-code-session-switcher": patch
---

Actually fix the macOS arm64 binary launch issue. The previous ad-hoc codesign step failed in CI with `invalid or unsupported format for signature` because bun's `--compile` output embeds a broken partial signature that `codesign -f` cannot overwrite. Strip it first with `codesign --remove-signature`, then apply the ad-hoc signature.
