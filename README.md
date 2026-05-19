# Recursive Agentic Improvements

A collection of Claude Code workflow documents for **creating**, **improving**, and **extending** AI agents across major agentic frameworks. Inspired by the recursive agent improvement methodology described by the Agno AI founder.

---

## What This Repository Is

This repo provides three reusable Claude Code runbooks per framework and use case:

| File | Purpose |
|---|---|
| `create-new-agent.md` | Scaffold a new agent from scratch with proper structure, instructions, and tools |
| `improve-agent.md` | Recursively test and improve an existing agent against its own spec |
| `extend-agent.md` | Add a new capability, tool, or behaviour to an existing agent |

### Supported Frameworks

| Framework | Use Cases Covered |
|---|---|
| [Agno](https://docs.agno.com) | Chatbot, Research Assistant |
| [CrewAI](https://docs.crewai.com) | Research Crew, Content Pipeline |
| [LangGraph](https://langchain-ai.github.io/langgraph/) | ReAct Agent, Multi-Agent Supervisor |
| [Google ADK](https://google.github.io/adk-docs/) | Chatbot, Tool-Using Agent |

---

## Repository Structure

```
docs/
├── create-new-agent.md          # Framework-agnostic entry point
├── improve-agent.md             # Framework-agnostic entry point
├── extend-agent.md              # Framework-agnostic entry point
├── agno/
│   ├── chatbot/
│   │   ├── create-new-agent.md
│   │   ├── improve-agent.md
│   │   └── extend-agent.md
│   └── research-assistant/
│       ├── create-new-agent.md
│       ├── improve-agent.md
│       └── extend-agent.md
├── crewai/
│   ├── research-crew/
│   └── content-pipeline/
├── langgraph/
│   ├── react-agent/
│   └── multi-agent-supervisor/
└── google-adk/
    ├── chatbot/
    └── tool-using-agent/
```

---

## How to Use

### Prerequisites

- [Claude Code CLI](https://claude.ai/code) installed and authenticated
- Target framework installed in your project (`agno`, `crewai`, `langgraph`, or `google-adk`)
- For Agno and LangGraph/LangSmith: MCP servers configured (see below)

### Workflow 1 — Create a New Agent

Open Claude Code in your project directory and type:

```
Run docs/create-new-agent.md in a new branch
```

Claude Code will ask a few questions, select the right framework sub-guide, scaffold the agent, and run smoke tests.

### Workflow 2 — Improve an Existing Agent

```
Run docs/improve-agent.md
```

Claude Code reads your agent's `INSTRUCTIONS`, derives 8–12 test probes, runs them against the live agent, judges PASS/FAIL, applies targeted fixes, and iterates until all probes pass.

### Workflow 3 — Extend an Agent

```
Run docs/extend-agent.md
```

Claude Code asks what capability you want to add, searches framework documentation, plans the change, implements it, and validates.

### Using Framework-Specific Guides Directly

You can also invoke a specific guide:

```
Run docs/agno/research-assistant/improve-agent.md
Run docs/langgraph/react-agent/create-new-agent.md
Run docs/crewai/research-crew/extend-agent.md
```

---

## What Makes This Work

Three platform requirements must be in place for the recursive improvement loop to function:

1. **API-accessible platform** — the agent container must be reachable via `curl` or SDK so Claude Code can push inputs and read outputs.
2. **Structured logging** — Claude Code needs system logs, errors, and warnings, not just trace data. It is improving the *system*, not just the prompt.
3. **Framework docs as MCP** — Claude Code can search and query framework documentation in real time, enabling it to suggest correct APIs and patterns.

### Recommended MCP Servers

| Framework | MCP Setup |
|---|---|
| Agno | `transport: streamable-http`, `url: https://docs.agno.com/mcp` |
| LangGraph / LangSmith | LangSmith MCP server (see LangSmith docs) |
| Google ADK | Add `https://adk.dev/llms-full.txt` as a context document |
| CrewAI | Add docs via WebFetch or configure a local MCP proxy |

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
