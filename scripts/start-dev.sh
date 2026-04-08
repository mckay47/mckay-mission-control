#!/bin/bash
# MCKAY Mission Control — Dev Server Auto-Start
# Used by launchd: ~/Library/LaunchAgents/com.mckay.mission-control.plist

# Load nvm if present
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

# Load homebrew if present (for npm via homebrew node)
[ -f "/opt/homebrew/bin/brew" ] && eval "$(/opt/homebrew/bin/brew shellenv)"

# Navigate to project
cd "$HOME/mckay-os/projects/mission-control" || exit 1

# Run dev server
exec npm run dev
