# install.ps1 — Install agentic improvement skills into a target project
#
# Usage:
#   .\install.ps1                               # install into current directory
#   .\install.ps1 -TargetProject C:\my\project  # install into a specific directory
#
# This copies .claude\commands\{create-agent,improve-agent,extend-agent}.md
# into the target project's .claude\commands\ directory, enabling
# /create-agent, /improve-agent, and /extend-agent as Claude Code slash commands.

param(
    [string]$TargetProject = (Get-Location).Path
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceDir = Join-Path $ScriptDir ".claude\commands"
$TargetDir = Join-Path $TargetProject ".claude\commands"

$Skills = @(
    "create-agent.md",
    "improve-agent.md",
    "extend-agent.md"
)

Write-Host ""
Write-Host "Recursive Agentic Improvement Skills — Installer"
Write-Host "================================================="
Write-Host "Source:  $SourceDir"
Write-Host "Target:  $TargetDir"
Write-Host ""

# Check source exists
if (-not (Test-Path $SourceDir)) {
    Write-Error "Source directory not found: $SourceDir`nRun this script from the recursive-agentic-improvements repo root."
    exit 1
}

# Check target project exists
if (-not (Test-Path $TargetProject)) {
    Write-Error "Target project directory not found: $TargetProject"
    exit 1
}

# Create target directory
New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null

# Copy each skill
$Installed = 0
foreach ($skill in $Skills) {
    $src = Join-Path $SourceDir $skill
    $dst = Join-Path $TargetDir $skill

    if (-not (Test-Path $src)) {
        Write-Warning "Skill not found, skipping: $src"
        continue
    }

    if (Test-Path $dst) {
        Write-Host "  [UPDATE] $skill"
    } else {
        Write-Host "  [NEW]    $skill"
    }

    Copy-Item -Path $src -Destination $dst -Force
    $Installed++
}

Write-Host ""
Write-Host "Installed $Installed skill(s) to $TargetDir"
Write-Host ""
Write-Host "Usage in Claude Code (inside $TargetProject):"
Write-Host "  /create-agent agno chatbot"
Write-Host "  /improve-agent"
Write-Host "  /extend-agent langgraph react-agent"
Write-Host ""
Write-Host "Run /create-agent, /improve-agent, or /extend-agent for interactive prompting."
