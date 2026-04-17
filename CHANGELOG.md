# claude-code-session-switcher

## 0.2.4

### Patch Changes

- 88e9039: Fix macOS arm64 binary being killed on launch by ad-hoc codesigning the release binary in CI. Unsigned arm64 executables are rejected by AMFI on recent macOS versions (`load code signature error 4`).

## 0.2.3

### Patch Changes

- 10ab872: Maintenance release to validate the new publish workflow that creates GitHub Releases separately from the version PR flow.

## 0.2.2

### Patch Changes

- ae99424: Maintenance release to validate the changesets-based release workflow and publish prebuilt native binaries via GitHub Releases.
