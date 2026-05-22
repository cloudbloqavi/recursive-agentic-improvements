#!/usr/bin/env bash
# install.sh — Install agentic improvement skills into a target project
#
# Usage:
#   ./install.sh                          # install into current directory
#   ./install.sh /path/to/target-project  # install into a specific directory
#
# This copies .claude/commands/{create-agent,improve-agent,extend-agent}.md
# into the target project's .claude/commands/ directory, enabling
# /create-agent, /improve-agent, and /extend-agent as Claude Code slash commands.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/.claude/commands"
TARGET_PROJECT="${1:-$(pwd)}"
TARGET_DIR="$TARGET_PROJECT/.claude/commands"

SKILLS=(
  "create-agent.md"
  "improve-agent.md"
  "extend-agent.md"
)

echo ""
echo "Recursive Agentic Improvement Skills — Installer"
echo "================================================="
echo "Source:  $SOURCE_DIR"
echo "Target:  $TARGET_DIR"
echo ""

# Check source exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "ERROR: Source directory not found: $SOURCE_DIR"
  echo "Run this script from the recursive-agentic-improvements repo root."
  exit 1
fi

# Check target project exists
if [ ! -d "$TARGET_PROJECT" ]; then
  echo "ERROR: Target project directory not found: $TARGET_PROJECT"
  exit 1
fi

# Create target directory
mkdir -p "$TARGET_DIR"

# Copy each skill
installed=0
for skill in "${SKILLS[@]}"; do
  src="$SOURCE_DIR/$skill"
  dst="$TARGET_DIR/$skill"

  if [ ! -f "$src" ]; then
    echo "WARNING: Skill not found, skipping: $src"
    continue
  fi

  if [ -f "$dst" ]; then
    echo "  [UPDATE] $skill"
  else
    echo "  [NEW]    $skill"
  fi

  cp "$src" "$dst"
  ((installed++))
done

echo ""
echo "Installed $installed skill(s) to $TARGET_DIR"
echo ""
echo "Usage in Claude Code (inside $TARGET_PROJECT):"
echo "  /create-agent agno chatbot"
echo "  /improve-agent"
echo "  /extend-agent langgraph react-agent"
echo ""
echo "Run /create-agent, /improve-agent, or /extend-agent for interactive prompting."
