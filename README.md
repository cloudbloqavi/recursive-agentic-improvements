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

The skills work for **any domain** — not a fixed list of presets. The research phase discovers what tools and APIs exist for your specific use case before writing code.

| Framework | Docs source | Example domains |
|---|---|---|
| [Agno](https://docs.agno.com) | MCP + WebFetch | Travel, legal, customer support, finance, healthcare |
| [CrewAI](https://docs.crewai.com) | MCP + WebFetch | Research crews, content pipelines, HR automation, competitive intelligence |
| [LangGraph](https://langchain-ai.github.io/langgraph/) | MCP + WebFetch | DevOps agents, multi-agent supervisors, ReAct agents, data pipelines |
| [Google ADK](https://google.github.io/adk-docs/) | WebFetch | IoT monitoring, appointment scheduling, tool-using assistants |

---

## Quick Install

You can install the three skill files into your project's `.claude/commands/` directory using `npx`.

From inside your target project directory, run:
```bash
npx recursive-agentic-improvements
```

Or you can install into a specific target project folder:
```bash
npx recursive-agentic-improvements /path/to/your-agentic-project
```

**Local install (from clone):**
If you have cloned this repository locally, you can run the installer using `npx`:
```bash
# Run from the repository root to copy to another directory:
npx ./installer /path/to/your-agentic-project

# Or run from inside your target project:
npx /path/to/recursive-agentic-improvements/installer
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

installer/                        # npx installer package
tests/                            # Showcase agents and tests for all frameworks
.env.example                      # Environment variables template
```

---

## Showcase Examples & Testing

This repository includes a `tests/` directory containing static, verified reference implementations of minimal agents for each framework. You can use these to test the `/improve-agent` or `/extend-agent` skills in action.

To get the best performance and avoid virtual environment overhead, we recommend installing dependencies directly in your active Python environment. If you encounter version conflicts between frameworks, simply uninstall/install or upgrade/downgrade required packages for that specific test scenario, **OR** use an isolated virtual environment (`venv`) for each framework as a fallback.

### Quick Setup Example (Agno)

**Option 1: Direct Execution (Recommended)**
1. **Install and configure:**
   ```bash
   pip install -r tests/agno/requirements.txt
   cp .env.example .env
   ```
2. **Run tests:**
   Run the unit tests using `pytest` directly from the repository root:
   ```bash
   python -m pytest tests/agno/
   ```

**Option 2: Isolated Virtual Environment Execution (Fallback)**
1. **Navigate and set up environment:**
   ```bash
   cd tests/agno
   python -m venv venv
   # Windows: .\venv\Scripts\activate
   # macOS/Linux: source venv/bin/activate
   ```
2. **Install and configure:**
   ```bash
   pip install -r requirements.txt
   cp ../../.env.example .env
   ```
3. **Run tests:**
   Run the unit tests using the virtual environment's `pytest` directly:
   ```bash
   # On Windows: .\venv\Scripts\pytest
   # On macOS/Linux: ./venv/bin/pytest
   ```

For detailed instructions on setting up and running tests for all other frameworks, see the [Showcase README](tests/README.md).

---

## How to Use

### Prerequisites

- [Claude Code CLI](https://claude.ai/code) installed and authenticated
- Target framework installed in your project (`agno`, `crewai`, `langgraph`, or `google-adk`)
- MCP servers for Agno, LangGraph, and CrewAI are optional but strongly recommended — the skills auto-detect if they are missing and print the exact setup snippet (see [Recommended MCP Servers](#recommended-mcp-servers) below)

### Skill 1 — Create a New Agent

There are two ways to invoke `/create-agent`:

#### Option A — Template-based (quick start with a known pattern)

Pass `framework use-case` to start from a well-tested structural template. Claude Code scaffolds the standard project layout for that use case, then runs smoke tests and commits.

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

Use this when your agent maps closely to one of the standard patterns above.

#### Option B — Free-form description (any domain, any use case)

Pass a plain-English description of what the agent should do. The research phase queries live framework docs (via MCP / WebFetch / WebSearch) to discover the right tools, APIs, and architecture for your specific domain — before writing a single line of code.

```
/create-agent agno a travel assistant that searches flights, books hotels, and sends confirmation emails
```

```
/create-agent crewai a competitive intelligence crew that monitors competitor pricing and generates weekly reports
```

```
/create-agent langgraph a DevOps automation agent that monitors CI pipelines, diagnoses failures, and opens GitHub issues
```

```
/create-agent google-adk a medical appointment scheduler that checks doctor availability and sends SMS reminders
```

Or just `/create-agent` with no arguments — Claude Code will ask for the framework and description interactively.

**Any domain works.** The research phase handles discovery dynamically:

| Domain | Example free-form prompt |
|---|---|
| Legal | `/create-agent agno a legal document summariser that extracts clauses and flags risks` |
| Finance | `/create-agent langgraph a portfolio monitor that tracks holdings and alerts on threshold breaches` |
| HR | `/create-agent crewai an HR onboarding crew that generates offer letters and sends welcome packs` |
| IoT / DevOps | `/create-agent google-adk an infrastructure agent that reads Datadog alerts and triggers runbooks` |
| E-commerce | `/create-agent agno a customer support bot that handles billing and refund queries` |
| Research | `/create-agent crewai a research crew that searches academic papers and synthesises findings` |

### Skill 2 — Improve an Existing Agent

```
/improve-agent agno agents/my-bot/agent.py
```

Or just `/improve-agent`. Claude Code reads your agent's `INSTRUCTIONS`, derives 10 test probes across golden-path, edge-case, tool-selection, constraint, and adversarial categories, runs them against the live agent, judges PASS/FAIL, and applies targeted fixes — iterating until all 10 probes pass.

```
/improve-agent crewai src/research-crew
/improve-agent langgraph src/my-agent
/improve-agent google-adk my_agent
```

### Skill 3 — Extend an Agent

Describe the new capability in plain English — no preset categories required:

```
/extend-agent agno agents/travel-assistant/agent.py
→ "Add a human approval step before any booking is confirmed"
```

```
/extend-agent crewai src/research-crew
→ "Add a fact-checker agent that verifies every claim before the report is published"
```

```
/extend-agent langgraph src/devops-agent
→ "Add a Slack notification tool so the agent posts a summary after every pipeline fix"
```

```
/extend-agent google-adk my_agent
→ "Return structured JSON output instead of plain text so our frontend can parse it"
```

Or just `/extend-agent` — Claude Code asks which agent to extend and what capability to add.

---

## How the Skills Work

Every skill follows a **Research → Plan → Scaffold** pipeline. This is what makes them work for any domain — not just the 8 presets from earlier versions.

### The three-phase pipeline

```
PHASE 1 — RESEARCH
  Query MCP / WebFetch / WebSearch to discover:
  → Native tools that exist for the agent's domain
  → Correct API signatures and import paths
  → Gaps where custom tools are needed
  → External services and API keys required
  Output: Research Report shown to the developer

PHASE 2 — PLAN
  Generate a domain-specific Agent Blueprint:
  → INSTRUCTIONS outline tailored to the domain
  → Tools list with verified import paths from research
  → Project structure
  Developer confirms the plan before any code is written

PHASE 3 — SCAFFOLD / IMPLEMENT
  Create files using the framework's structural pattern
  Fill all content from the Blueprint (not from hardcoded templates)
  Run smoke tests derived from the domain
  Commit
```

This means `/create-agent agno` works equally well for a travel assistant, a legal document analyser, a medical scheduler, or a DevOps automation agent. The research phase discovers what tools and APIs actually exist for that domain before a single line of code is written.

Three platform requirements must also be in place for the recursive improvement loop to function:

1. **API-accessible platform** — the agent must be reachable via Python SDK or CLI so the skill can push inputs and read outputs.
2. **Structured logging** — the skill reads raw logs, errors, and tool calls — not just the final response. It is improving the *system*, not just the prompt.
3. **Framework docs via MCP** — the skills query live documentation so generated API patterns match the installed framework version (see [Recommended MCP Servers](#recommended-mcp-servers)).

### Recommended MCP Servers

Each skill **automatically checks** whether the relevant MCP server is available when it runs. If an MCP server is missing, the skill prints the exact setup snippet and tells you whether it is safe to continue or whether you should configure MCP first.

| Framework | How docs are fetched | Blocking if missing? |
|---|---|---|
| Agno | MCP server at `https://docs.agno.com/mcp` | Warn + continue (`/create-agent`, `/improve-agent`); ask user (`/extend-agent`) |
| LangGraph | MCP server at `https://docs.langchain.com/mcp`, fallback WebFetch `https://langchain-ai.github.io/langgraph/llms.txt` | Warn + continue (`/create-agent`, `/improve-agent`); ask user (`/extend-agent`) |
| CrewAI | MCP server at `https://docs.crewai.com/mcp`, fallback WebFetch `https://docs.crewai.com/llms.txt` | Warn + continue (`/create-agent`, `/improve-agent`); ask user (`/extend-agent`) |
| Google ADK | WebFetch `https://google.github.io/adk-docs/llms.txt` | Warn + continue |

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

**LangGraph / LangChain:**
```json
{
  "mcpServers": {
    "langchain-docs": {
      "type": "http",
      "url": "https://docs.langchain.com/mcp"
    }
  }
}
```

**CrewAI:**
```json
{
  "mcpServers": {
    "crewai-docs": {
      "type": "http",
      "url": "https://docs.crewai.com/mcp"
    }
  }
}
```

After adding MCP servers, restart Claude Code for them to take effect.

Google ADK does not have a dedicated MCP server — the skills fetch its docs via `WebFetch https://google.github.io/adk-docs/llms.txt` automatically.

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

To verify and test changes in this repository:

### 1. Showcase Unit Tests
Verify the syntax and structure of the framework showcases (no LLM calls or API keys required). 

**Option 1: Direct Execution (Recommended)**
You can run tests using `pytest` directly from the repository root:
```bash
python -m pytest tests/<framework>/
```

**Option 2: Isolated Virtual Environment Execution (Fallback)**
You can run tests using the virtual environment's `pytest` executable directly:
```bash
# On Windows (PowerShell):
.\tests\<framework>\venv\Scripts\pytest tests/<framework>/

# On macOS/Linux:
./tests/<framework>/venv/bin/pytest tests/<framework>/
```

See the [Showcase README](tests/README.md) for detailed direct and virtual environment setup instructions for each framework.

### 2. Manual Skill Verification
To validate that the Claude Code commands/skills function correctly inside a project:
1. Follow the isolated testing setup described in `CLAUDE.md` under "Self-testing a skill in isolation".
2. Run `/improve-agent` or `/extend-agent` targeting one of the showcase folders inside `tests/` to verify that the recursive improvement loops run correctly.

### 3. Automated Validation (CI)
A GitHub Actions workflow will:
- Lint all markdown files for required sections.
- Validate code snippets for syntax errors.
- Run a dry-run of the create workflow against a minimal mock agent.

---

## Design Principles

- **Research before code.** Every skill queries live framework docs (MCP / WebFetch / WebSearch) to discover what tools and APIs actually exist before writing a single line. No hardcoded use-case templates.
- **Show the plan, get confirmation.** Each skill outputs a Research Report and an Agent Blueprint for the developer to review before any files are created or modified.
- **The agent IS the spec.** Improvement probes are derived from the agent's own `INSTRUCTIONS`, not a separate test suite.
- **Research-driven fixes.** When a probe fails due to an API or tool problem, `/improve-agent` searches current docs for the correct fix instead of guessing from training data.
- **Logs over traces.** The skills improve the system by reading raw logs, errors, and tool calls — not just pretty trace visualisations.
- **Any domain, any use case.** The pipeline works for travel agents, legal assistants, DevOps pipelines, medical schedulers, or anything else — the research phase handles domain discovery dynamically.

---

## License

MIT — see [LICENSE](LICENSE).
