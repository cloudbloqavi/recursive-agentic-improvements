# Showcase Agents & Tests

This directory contains static, verified reference implementations of minimal agents for each supported framework. All showcase tests follow the repository's [Test Constitution](../tests/TEST_CONSTITUTION.md) utilizing mocked execution layers for fast, deterministic execution.

Developers and collaborators can use these examples to:
1. Verify their environment setup before installing the skills.
2. Run as a test target for `/improve-agent` or `/extend-agent` to check how the recursive improvement loops function.
3. Understand the standard file structures, import paths, and syntax used by the latest versions of each framework.

---

## Supported Frameworks & Tested Versions

| Framework | Verified Version | Showcase Path | Run Command |
|---|---|---|---|
| **Agno** | 2.6.9 | `tests/agno/` | `python -m tests.agno.agent_test` |
| **CrewAI** | 1.14.5 | `tests/crewai/` | `python -m tests.crewai.main` |
| **LangGraph** | 1.2.1 | `tests/langgraph/` | `python -m tests.langgraph.run` |
| **Google ADK** | 2.0.0 | `tests/google_adk/` | `python -m tests.google_adk.run` |

---

## Setup & Run Instructions

To get the best performance and avoid virtual environment overhead, we recommend using the `uv` toolchain. `uv` manages a unified virtual environment via `pyproject.toml` and resolves packages cleanly.

### Framework Showcase Command Summary

| Framework | Dependencies | Run Agent Command | Run Tests Command |
|---|---|---|---|
| **Agno** | `uv sync --extra agno` | `uv run python -m tests.agno.agent_test` | `uv run pytest tests/agno/` |
| **CrewAI** | `uv sync --extra crewai` | `uv run python -m tests.crewai.main` | `uv run pytest tests/crewai/` |
| **LangGraph** | `uv sync --extra langgraph` | `uv run python -m tests.langgraph.run` | `uv run pytest tests/langgraph/` |
| **Google ADK** | `uv sync --extra google-adk` | `uv run python -m tests.google_adk.run` | `uv run pytest tests/google_adk/` |

> [!NOTE]
> Ensure you copy the environment template (`cp .env.example .env`) and populate the required API keys (e.g. `OPENAI_API_KEY`, `GOOGLE_API_KEY`) before running the agents.

---

### 1. Direct Execution via `uv` (Recommended)

Run the following commands directly from the repository root:

#### Agno Calculator Agent
```bash
# Sync dependencies
uv sync --extra agno

# Run the agent
uv run python -m tests.agno.agent_test

# Run unit tests
uv run pytest tests/agno/
```

#### CrewAI Research & Writing Crew
```bash
# Sync dependencies
uv sync --extra crewai

# Run the agent
uv run python -m tests.crewai.main

# Run unit tests
uv run pytest tests/crewai/
```

#### LangGraph Multiplication Agent
```bash
# Sync dependencies
uv sync --extra langgraph

# Run the agent
uv run python -m tests.langgraph.run

# Run unit tests
uv run pytest tests/langgraph/
```

#### Google ADK Weather Agent
```bash
# Sync dependencies
uv sync --extra google-adk

# Run the agent
uv run python -m tests.google_adk.run

# Run unit tests
uv run pytest tests/google_adk/
```

---

### 2. Unified Workspace Setup

To install all frameworks and dependencies into a single, unified local virtual environment, simply run:

```bash
uv sync --all-extras
```

Once synced, you can execute any agent or test suite directly from the root without activating virtual environments manually:

```bash
# Run all tests in the repository
uv run pytest

# Run a specific framework's tests
uv run pytest tests/langgraph/
```
