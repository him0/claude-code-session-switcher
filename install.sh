#!/bin/sh
set -eu

REPO="him0/claude-code-session-switcher"
BINARY_NAME="ccss"
INSTALL_DIR="${CCSS_INSTALL_DIR:-$HOME/.local/bin}"

case "$(uname -s)" in
  Linux) os="linux" ;;
  Darwin) os="darwin" ;;
  *) echo "Unsupported OS: $(uname -s)" >&2; exit 1 ;;
esac

case "$(uname -m)" in
  x86_64 | amd64) arch="x64" ;;
  arm64 | aarch64) arch="arm64" ;;
  *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

if [ "$os" = "darwin" ] && [ "$arch" = "x64" ]; then
  echo "Intel Mac (darwin-x64) is not supported. Apple Silicon only." >&2
  exit 1
fi

asset="ccss-${os}-${arch}"

tag="${CCSS_VERSION:-}"
if [ -z "$tag" ]; then
  tag=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep -oE '"tag_name":\s*"[^"]+"' \
    | sed -E 's/.*"([^"]+)".*/\1/')
fi
if [ -z "$tag" ]; then
  echo "Failed to determine release tag. Set CCSS_VERSION to pin a version." >&2
  exit 1
fi

url="https://github.com/${REPO}/releases/download/${tag}/${asset}"

mkdir -p "$INSTALL_DIR"
tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT INT TERM

echo "Downloading ${asset} ${tag}..."
if ! curl -fsSL -o "$tmp" "$url"; then
  echo "Failed to download $url" >&2
  exit 1
fi

install_path="$INSTALL_DIR/$BINARY_NAME"
mv "$tmp" "$install_path"
chmod +x "$install_path"

echo "Installed ccss ${tag} -> $install_path"

case ":$PATH:" in
  *:"$INSTALL_DIR":*) ;;
  *)
    echo
    echo "Note: $INSTALL_DIR is not in your PATH."
    echo "Add it to your shell rc:"
    echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
    ;;
esac
