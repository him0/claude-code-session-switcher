---
"claude-code-session-switcher": patch
---

Fix macOS arm64 binary being killed on launch by ad-hoc codesigning the release binary in CI. Unsigned arm64 executables are rejected by AMFI on recent macOS versions (`load code signature error 4`).
