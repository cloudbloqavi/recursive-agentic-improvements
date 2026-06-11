# 🚀 Recursive Agentic Improvements

> 🔗 **[Live Landing Page](https://cloudbloqavi.github.io/recursive-agentic-improvements/)**
>
> **New to AI Agent engineering?** Get started immediately with our step-by-step **[Quickstart Guide (5-Minute Path)](QUICKSTART.md)**.

---

## 🎨 Project Overview & Architecture

This repository contains Claude Code **skills** (custom slash commands) that automate the creation, testing, and recursive optimization of AI agents across Agno, CrewAI, LangGraph, and Google ADK.

![Agent Skills Workflow](docs/assets/hero_concept.png)

---

## 📂 Repository Index & Roadmap

This project is organized to separate the Claude Code skills, reference guides, and mock-based showcases. Use this map to navigate the codebase:

| Document | Purpose | Path |
|---|---|---|
| **Quickstart Guide** | 5-minute setup, core terminology, and sandbox walkthroughs. | [QUICKSTART.md](QUICKSTART.md) |
| **Testing Constitution** | Standard for writing offline, mock-based unit tests for agents. | [TEST_CONSTITUTION.md](tests/TEST_CONSTITUTION.md) |
| **Showcase Guidelines** | Running and testing sandbox agents for each framework. | [Showcase README](tests/README.md) |
| **Contributor Guidelines** | Developer instructions and testing protocol. | [CLAUDE.md](CLAUDE.md) |
| **License** | MIT License terms. | [LICENSE](LICENSE) |

---

## 🛠️ Claude Code Skills (Slash Commands)

These skills are self-contained markdown documents under [.claude/commands/](.claude/commands/). Once installed, you can run them directly in your project:

| Skill Command | Core Function | Blueprint File |
|---|---|---|
| `/create-agent` | Scaffolds a new agent from scratch by researching live docs and planning structure. | [create-agent.md](.claude/commands/create-agent.md) |
| `/improve-agent` | Recursively executes behavioral probes, analyzes logs, and refines prompts. | [improve-agent.md](.claude/commands/improve-agent.md) |
| `/extend-agent` | Adds new tools or capabilities safely to an existing agent's configuration. | [extend-agent.md](.claude/commands/extend-agent.md) |

---

## ⚡ Installation Guide

### Prerequisites

Before installing, confirm you have the following:

| Requirement | Required? | Notes |
|---|---|---|
| **Node.js ≥ 18** | Yes | Required to run `npx`. Check: `node --version` |
| **npm ≥ 9** (or npx) | Yes | Bundled with Node.js. Check: `npm --version` |
| **Git** | Optional | Only needed if cloning locally (Option B) |
| **Claude Code CLI** | Optional | Required only if installing for Claude Code. Install: `npm i -g @anthropic-ai/claude-code` |
| **ANTHROPIC_API_KEY** | Optional | Required at runtime for Claude-backed agents. Not needed for install. |
| **Target project directory** | Yes | A folder where your agent project lives (or will live). |

---

### Step 1 — Open a terminal inside your target project

Navigate to the directory where you want the skills installed:

```bash
cd /path/to/your-project
```

> If the project doesn't exist yet, create it first:
> ```bash
> mkdir my-agent-project && cd my-agent-project && git init
> ```

---

### Step 2 — Run the installer

#### Option A — Direct from GitHub (Recommended)

```bash
npx github:cloudbloqavi/recursive-agentic-improvements
```

This launches an **interactive multi-select prompt** in your terminal:

```
  ▶ ●  Claude Code            .claude/commands/
    ○  Cursor                 .cursor/rules/
    ○  GitHub Copilot         .github/instructions/
    ○  Roo Code               .roo/rules/
    ○  Windsurf               .windsurf/rules/
    ○  OpenAI Codex           . (project root)
    ○  Google Antigravity     .agents/rules/
    ○  Other / Custom         .coding/

  [Space] toggle  [↑↓] move  [a] toggle all  [Enter] confirm  [Ctrl+C] cancel
```

- Use **↑ ↓** to move between options
- Press **Space** to toggle an environment on/off
- Press **a** to select or deselect all
- Press **Enter** to install to all selected targets

Skills are installed to every selected target in one run.

#### Option B — Skip the prompt (scripting / CI)

Pass `--agent <name>` to install directly without interaction:

```bash
npx github:cloudbloqavi/recursive-agentic-improvements --agent claude
npx github:cloudbloqavi/recursive-agentic-improvements --agent cursor
npx github:cloudbloqavi/recursive-agentic-improvements --agent copilot
```

| `--agent` value | Tool | Installs into |
|---|---|---|
| `claude` | Claude Code | `.claude/commands/` |
| `cursor` | Cursor | `.cursor/rules/` |
| `copilot` | GitHub Copilot | `.github/instructions/` |
| `roo` | Roo Code | `.roo/rules/` |
| `windsurf` | Windsurf | `.windsurf/rules/` |
| `codex` | OpenAI Codex | `.` (project root) |
| `antigravity` | Google Antigravity | `.agents/rules/` |
| `other` | Custom / Other | `.coding/` *(rename after install)* |

#### Option C — Local clone

If you have cloned this repository locally:

```bash
npx ./installer /path/to/your-project
npx ./installer /path/to/your-project --agent cursor
```

---

### Step 3 — (If you selected "Other") Rename the install folder

If you chose **Other / Custom**, skills land in `.coding/`. Rename it to match your tool's expected directory:

```bash
# Example — replace with your tool's actual folder
mv .coding .myagent/rules
```

The installer will print a reminder with this instruction after it finishes.

---

### Step 4 — Verify the installation

Check that the skill files are present in the expected directory:

```bash
# Claude Code
ls .claude/commands/
# → create-agent.md  extend-agent.md  improve-agent.md

# Cursor
ls .cursor/rules/
# → create-agent.mdc  extend-agent.mdc  improve-agent.mdc

# GitHub Copilot
ls .github/instructions/
```

---

### Step 5 — Use the skills

Open your AI coding tool and run a skill command:

| Tool | How to invoke |
|---|---|
| **Claude Code** | `/create-agent agno chatbot` · `/improve-agent` · `/extend-agent` |
| **Cursor** | Skills auto-load from `.cursor/rules/` — reference them in your prompt |
| **GitHub Copilot** | Instructions auto-load from `.github/instructions/` |
| **Roo / Windsurf** | Rules apply automatically to the project |
| **Codex** | Pass skill files as context or reference them in `AGENTS.md` |
| **Antigravity** | Rules are active under `.agents/rules/` in the Agent Manager |

*For a full walkthrough, see [QUICKSTART.md](QUICKSTART.md#step-1-install-the-skills-into-your-project).*

---

## 📖 Framework Documentation Index

The `docs/` directory contains framework-agnostic entry points and specific guides that drive the skills. Use these files to reference syntax and architecture patterns:

*   **Universal Runbooks**:
    *   [Universal Create Runbook](docs/create-new-agent.md)
    *   [Universal Improve Runbook](docs/improve-agent.md)
    *   [Universal Extend Runbook](docs/extend-agent.md)

*   **Framework-Specific Directories**:
    *   **Agno**: [Chatbot](docs/agno/chatbot/create-new-agent.md) · [Research Assistant](docs/agno/research-assistant/create-new-agent.md)
    *   **CrewAI**: [Content Pipeline](docs/crewai/content-pipeline/create-new-agent.md) · [Research Crew](docs/crewai/research-crew/create-new-agent.md)
    *   **LangGraph**: [ReAct Agent](docs/langgraph/react-agent/create-new-agent.md) · [Multi-Agent Supervisor](docs/langgraph/multi-agent-supervisor/create-new-agent.md)
    *   **Google ADK**: [Chatbot](docs/google-adk/chatbot/create-new-agent.md) · [Tool-Using Agent](docs/google-adk/tool-using-agent/create-new-agent.md)

---

## 🎯 Design Principles

*   **Research Before Code**: Skills query live documentation via MCP servers or search APIs to identify native tools and imports before generating files.
*   **Blueprint Gatekeeping**: All operations generate a detailed blueprint that requires explicit developer confirmation before executing disk writes.
*   **The Spec is the Source of Truth**: Agent behavioral probe suites are dynamically derived from the agent's prompt/system instructions (`INSTRUCTIONS`), verifying promises directly.
*   **Determinism by Default**: Evaluation layers use mocked models (`GenericFakeChatModel` or unittest mocks) to run offline-friendly, fast, and key-free test suites.

---

## 💡 Support & Contribution

If you want to contribute framework templates or improvements, please review the rules in [CLAUDE.md](CLAUDE.md) first. For testing guidelines, refer to the [Test Constitution](tests/TEST_CONSTITUTION.md).
