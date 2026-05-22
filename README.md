# Recursive Agentic Improvements

A collection of Claude Code **skills** (slash commands) for **creating**, **improving**, and **extending** AI agents across major agentic frameworks. Inspired by the recursive agent improvement methodology described by the Agno AI founder.

---

## What This Repository Is

Three self-contained Claude Code skills you can install into any agentic project:

| Skill | Slash command | Purpose |
|---|---|---|
| `create-agent.md` | `/create-agent` | Scaffold a new agent from scratch with proper structure, instructions, and tools |
| `improve-agent.md` | `/improve-agent` | Recursively test and improve an existing agent against its own spec |
| `extend-agent.md` | `/extend-agent` | Add a new capability, tool, or behaviour to an existing agent |

Each skill is **self-contained**: it embeds all framework-specific guidance so it works in your own project without this repo present.

### Supported Frameworks

| Framework | Use Cases Covered |
|---|---|
| [Agno](https://docs.agno.com) | Chatbot, Research Assistant |
| [CrewAI](https://docs.crewai.com) | Research Crew, Content Pipeline |
| [LangGraph](https://langchain-ai.github.io/langgraph/) | ReAct Agent, Multi-Agent Supervisor |
| [Google ADK](https://google.github.io/adk-docs/) | Chatbot, Tool-Using Agent |

---

## Quick Install

Copy the three skill files into your project's `.claude/commands/` directory.

**macOS / Linux:**
```bash
# From inside this repo:
./install.sh /path/to/your-agentic-project

# Or install into the current directory:
./install.sh
```

**Windows (PowerShell):**
```powershell
# From inside this repo:
.\install.ps1 -TargetProject C:\path\to\your-agentic-project

# Or install into the current directory:
.\install.ps1
```

**Manual copy:**
```bash
cp .claude/commands/*.md /path/to/your-agentic-project/.claude/commands/
```

After installing, open Claude Code inside your project and use `/create-agent`, `/improve-agent`, or `/extend-agent`.

---

## Repository Structure

```
.claude/
└── commands/                    # ← Skills (install these into your project)
    ├── create-agent.md          # /create-agent skill
    ├── improve-agent.md         # /improve-agent skill
    └── extend-agent.md          # /extend-agent skill

docs/                            # Reference documentation (per-framework guides)
├── create-new-agent.md          # Framework-agnostic reference
├── improve-agent.md
├── extend-agent.md
├── agno/
│   ├── chatbot/
│   └── research-assistant/
├── crewai/
│   ├── research-crew/
│   └── content-pipeline/
├── langgraph/
│   ├── react-agent/
│   └── multi-agent-supervisor/
└── google-adk/
    ├── chatbot/
    └── tool-using-agent/

install.sh                       # Bash installer
install.ps1                      # PowerShell installer
```

---

## How to Use

### Prerequisites

- [Claude Code CLI](https://claude.ai/code) installed and authenticated
- Target framework installed in your project (`agno`, `crewai`, `langgraph`, or `google-adk`)
- MCP servers for Agno and LangGraph are optional but strongly recommended — the skills will detect if they are missing and print setup instructions (see [Recommended MCP Servers](#recommended-mcp-servers) below)

### Skill 1 — Create a New Agent

Open Claude Code in your project directory and type:

```
/create-agent agno chatbot
```

Or just `/create-agent` to be prompted. Claude Code asks questions, selects the right framework guide, scaffolds the agent, runs smoke tests, and commits.

Supported shorthand:
```
/create-agent agno chatbot
/create-agent agno research-assistant
/create-agent crewai research-crew
/create-agent crewai content-pipeline
/create-agent langgraph react-agent
/create-agent langgraph multi-agent-supervisor
/create-agent google-adk chatbot
/create-agent google-adk tool-using-agent
```

### Skill 2 — Improve an Existing Agent

```
/improve-agent agno agents/my-bot/agent.py
```

Or just `/improve-agent`. Claude Code reads your agent's `INSTRUCTIONS`, derives 10 test probes, runs them against the live agent, judges PASS/FAIL, applies targeted fixes, and iterates until all probes pass.

### Skill 3 — Extend an Agent

```
/extend-agent langgraph src/my-agent
```

Or just `/extend-agent`. Claude Code asks what capability you want to add, searches framework documentation, writes the plan (with your confirmation), implements it, and validates against 2+ new probes plus a regression check.

---

## What Makes This Work

Three platform requirements must be in place for the recursive improvement loop to function:

1. **API-accessible platform** — the agent container must be reachable via `curl` or SDK so Claude Code can push inputs and read outputs.
2. **Structured logging** — Claude Code needs system logs, errors, and warnings, not just trace data. It is improving the *system*, not just the prompt.
3. **Framework docs as MCP** — Claude Code can search and query framework documentation in real time, enabling it to suggest correct APIs and patterns.

### Recommended MCP Servers

Each skill **automatically checks** whether the relevant MCP server is available when it runs. If an MCP server is missing, the skill prints the exact setup snippet and tells you whether it is safe to continue or whether you should configure MCP first.

| Framework | How docs are fetched | Blocking if missing? |
|---|---|---|
| Agno | MCP server at `https://docs.agno.com/mcp` | Warn + continue (`/create-agent`, `/improve-agent`); ask user (`/extend-agent`) |
| LangGraph | MCP server — see [LangSmith MCP docs](https://docs.smith.langchain.com/how_to_guides/mcp) | Warn + continue (`/create-agent`, `/improve-agent`); ask user (`/extend-agent`) |
| Google ADK | WebFetch `https://google.github.io/adk-docs/llms.txt` | Warn + continue |
| CrewAI | WebFetch `https://docs.crewai.com/llms.txt` | Warn + continue |

#### Setting up MCP servers in Claude Code

Add MCP servers to your project's `.claude/settings.json` (or `~/.claude/settings.json` for global config):

**Agno:**
```json
{
  "mcpServers": {
    "agno-docs": {
      "type": "http",
      "url": "https://docs.agno.com/mcp"
    }
  }
}
```

**LangGraph / LangSmith:**
```json
{
  "mcpServers": {
    "langchain-docs": {
      "type": "http",
      "url": "<url from https://docs.smith.langchain.com/how_to_guides/mcp>"
    }
  }
}
```

After adding MCP servers, restart Claude Code for them to take effect.

Google ADK and CrewAI do not have dedicated MCP servers — the skills fetch their docs via `WebFetch` automatically.

---

## How to Contribute

1. **Fork** this repository.
2. Create a branch: `git checkout -b feat/framework-usecase-description`
3. Add or improve a workflow guide following the [template conventions](#template-conventions) below.
4. Open a pull request with a clear description of what the guide covers and how you tested it.

### Template Conventions

Every `create-new-agent.md`, `improve-agent.md`, and `extend-agent.md` must:

- Be written as **second-person imperative instructions** that Claude Code can follow step by step.
- Include a **Preconditions** section listing what must be true before running.
- Include a **Success Criteria** section defining when the workflow is complete.
- Reference framework-specific APIs and patterns accurately (cite the version/source).
- Include at least one concrete code skeleton or snippet.
- End with a **Commit & Push** step.

### Adding a New Framework

1. Create `docs/<framework-name>/` directory.
2. Add at least two use-case subdirectories.
3. Add all three workflow files for each use case.
4. Update this README's framework table.

### Adding a New Use Case

1. Create `docs/<framework-name>/<use-case>/` directory.
2. Add all three workflow files.
3. Reference any new tools or patterns in the framework-specific guide.

---

## How to Test

Each workflow guide is self-testing — it includes a smoke-test step that Claude Code runs as part of the workflow. To manually validate a guide:

1. Set up a clean project with the target framework installed.
2. Open Claude Code and run the guide.
3. Verify the agent starts, responds correctly to the smoke-test probes, and logs are clean.
4. For `improve-agent.md`, verify the probe loop runs at least one iteration and patches the agent on failure.

### Automated Validation (CI)

A GitHub Actions workflow (coming soon) will:
- Lint all markdown files for required sections.
- Validate code snippets for syntax errors.
- Run a dry-run of the create workflow against a minimal mock agent.

---

## Design Principles

- **The agent IS the spec.** Improvement probes are derived from the agent's own `INSTRUCTIONS`, not a separate test suite.
- **Logs over traces.** Claude Code improves the system by reading raw logs, errors, and warnings — not just pretty trace visualisations.
- **Hot reload.** After each fix, the agent is reloaded and the failing probes are re-run immediately — no manual restart.
- **Start simple, add complexity.** Every `create-new-agent.md` begins with the minimal viable agent (model + instructions + one tool) and layers in features only when needed.

---

## License

MIT — see [LICENSE](LICENSE).
