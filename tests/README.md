# Showcase Agents & Tests

This directory contains static, verified reference implementations of minimal agents for each supported framework. All showcase tests follow the repository's [Test Constitution](file:///c:/Users/aviji/repo/recursive-agentic-improvements/tests/TEST_CONSTITUTION.md) utilizing mocked execution layers for fast, deterministic execution.

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

To get the best performance and avoid virtual environment overhead, we recommend installing dependencies directly in your active Python environment. If you encounter package version conflicts, you can optionally set up isolated virtual environments.

### Framework Showcase Command Summary

| Framework | Dependencies | Run Agent Command | Run Tests Command |
|---|---|---|---|
| **Agno** | `pip install -r tests/agno/requirements.txt` | `python -m tests.agno.agent_test` | `python -m pytest tests/agno/` |
| **CrewAI** | `pip install -r tests/crewai/requirements.txt` | `python -m tests.crewai.main` | `python -m pytest tests/crewai/` |
| **LangGraph** | `pip install -r tests/langgraph/requirements.txt` | `python -m tests.langgraph.run` | `python -m pytest tests/langgraph/` |
| **Google ADK** | `pip install -r tests/google_adk/requirements.txt` | `python -m tests.google_adk.run` | `python -m pytest tests/google_adk/` |

> [!NOTE]
> Ensure you copy the environment template (`cp .env.example .env`) and populate the required API keys (e.g. `OPENAI_API_KEY`, `GOOGLE_API_KEY`) before running the agents.

---

### 1. Direct Execution (Recommended)

Run the following commands directly from the repository root:

#### Agno Calculator Agent
```bash
# Install dependencies
pip install -r tests/agno/requirements.txt

# Run the agent
python -m tests.agno.agent_test

# Run unit tests
python -m pytest tests/agno/
```

#### CrewAI Research & Writing Crew
```bash
# Install dependencies
pip install -r tests/crewai/requirements.txt

# Run the agent
python -m tests.crewai.main

# Run unit tests
python -m pytest tests/crewai/
```

#### LangGraph Multiplication Agent
```bash
# Install dependencies
pip install -r tests/langgraph/requirements.txt

# Run the agent
python -m tests.langgraph.run

# Run unit tests
python -m pytest tests/langgraph/
```

#### Google ADK Weather Agent
```bash
# Install dependencies
pip install -r tests/google_adk/requirements.txt

# Run the agent
python -m tests.google_adk.run

# Run unit tests
python -m pytest tests/google_adk/
```

---

### 2. Isolated Virtual Environment Execution (Optional Fallback)

If you run into dependency conflicts between frameworks (e.g. different `opentelemetry-api` version requirements), use an isolated virtual environment (`venv`) for each framework:

```bash
# 1. Create and activate a venv inside the framework directory
cd tests/<framework>
python -m venv venv
# Windows: .\venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run agent & tests from repository root
cd ../..
python -m tests.<framework>.<run_script>
# Run the unit tests using the virtual environment's pytest executable directly
# On Windows (PowerShell):
.\tests\<framework>\venv\Scripts\pytest tests/<framework>/
# On macOS/Linux:
./tests/<framework>/venv/bin/pytest tests/<framework>/
```
